import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { Observable, catchError, filter, map, of, switchMap, take } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CognitoService } from './cognito.service';
import { claimAFecha, decodificarJwt } from './jwt.util';

export type Proveedor = 'azure' | 'cognito';

/**
 * Fachada sobre los dos proveedores de login: MSAL (Entra ID) y AWS Cognito.
 *
 * Expone el estado de sesión como signals y centraliza la lectura de roles y
 * scopes desde los claims del token, para que los componentes no dependan
 * de cuál de los dos se usó.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msal = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cognito = inject(CognitoService);

  private readonly _cuenta = signal<AccountInfo | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _estado = signal<InteractionStatus>(InteractionStatus.Startup);

  /** Cuenta activa devuelta por Entra ID, o `null` si no hay sesión. */
  readonly cuenta = this._cuenta.asReadonly();

  /** `true` mientras MSAL está resolviendo un login, logout o refresco. */
  readonly ocupado = computed(() => this._estado() !== InteractionStatus.None);

  /** Con qué proveedor inició sesión el usuario, o `null` si no hay sesión. */
  readonly proveedor = computed<Proveedor | null>(() =>
    this.cognito.autenticado() ? 'cognito' : this._cuenta() !== null ? 'azure' : null,
  );

  readonly autenticado = computed(() => this.proveedor() !== null);

  readonly email = computed(() =>
    this.proveedor() === 'cognito'
      ? String(this.cognito.claims()['email'] ?? '')
      : (this._cuenta()?.username ?? ''),
  );

  readonly nombre = computed(() =>
    this.proveedor() === 'cognito'
      ? String(this.cognito.claims()['name'] ?? this.email())
      : (this._cuenta()?.name ?? ''),
  );

  /** Claims del ID token: identidad del usuario. */
  readonly idTokenClaims = computed<Record<string, unknown>>(() =>
    this.proveedor() === 'cognito'
      ? this.cognito.claims()
      : ((this._cuenta()?.idTokenClaims as Record<string, unknown> | undefined) ?? {}),
  );

  /** Token que viaja al API Gateway: access token de Entra ID o ID token de Cognito. */
  readonly accessToken = computed(() =>
    this.proveedor() === 'cognito' ? this.cognito.idToken() : this._accessToken(),
  );

  readonly accessTokenClaims = computed<Record<string, unknown>>(
    () => decodificarJwt(this.accessToken()) ?? {},
  );

  /**
   * App Roles asignados al usuario. Entra ID los emite en el claim `roles` y
   * Cognito en `cognito:groups`; los microservicios mapean ambos a `ROLE_*`.
   */
  readonly roles = computed<string[]>(() => {
    if (this.proveedor() === 'cognito') {
      return this.cognito.grupos();
    }
    const desdeAccessToken = this.accessTokenClaims()['roles'];
    const desdeIdToken = this.idTokenClaims()['roles'];
    const roles = Array.isArray(desdeAccessToken) ? desdeAccessToken : desdeIdToken;
    return Array.isArray(roles) ? (roles as string[]) : [];
  });

  /** Scopes delegados concedidos, emitidos por Entra ID en el claim `scp`. */
  readonly scopes = computed<string[]>(() => {
    const scp = this.accessTokenClaims()['scp'];
    return typeof scp === 'string' && scp.length > 0 ? scp.split(' ') : [];
  });

  /** Audiencia del access token: debe coincidir con la que valida el backend. */
  readonly audiencia = computed(() => {
    const aud = this.accessTokenClaims()['aud'];
    return typeof aud === 'string' ? aud : Array.isArray(aud) ? aud.join(', ') : '';
  });

  /** Emisor del token: debe coincidir con el issuer configurado en el backend. */
  readonly emisor = computed(() => {
    const iss = this.accessTokenClaims()['iss'];
    return typeof iss === 'string' ? iss : '';
  });

  readonly expiracion = computed(() => claimAFecha(this.accessTokenClaims()['exp']));

  /**
   * Se suscribe al ciclo de vida de MSAL. Debe llamarse una sola vez, desde el
   * componente raíz, después de `handleRedirectObservable()`.
   */
  inicializar(): void {
    this.broadcast.inProgress$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((estado) => {
        this._estado.set(estado);
        if (estado === InteractionStatus.None) {
          this.sincronizarCuenta();
        }
      });

    // Solo login/logout cambian la cuenta (escuchar todos los eventos generaba un bucle infinito)
    this.broadcast.msalSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((evento) => {
        switch (evento.eventType) {
          case EventType.LOGIN_SUCCESS:
          case EventType.LOGOUT_SUCCESS:
            if (this._estado() === InteractionStatus.None) {
              this.sincronizarCuenta();
            }
            break;
          case EventType.ACQUIRE_TOKEN_SUCCESS: {
            // Token renovado: se toma del evento sin volver a pedirlo
            const resultado = evento.payload as AuthenticationResult | null;
            if (resultado?.accessToken) {
              this._accessToken.set(resultado.accessToken);
            }
            break;
          }
        }
      });
  }

  /** Login con Microsoft (Entra ID), redirect con Authorization Code + PKCE. */
  login(destino = '/'): void {
    this.msal.loginRedirect({
      scopes: [...environment.api.scopes],
      redirectStartPage: `${window.location.origin}${destino}`,
    });
  }

  /** Login con AWS Cognito (Hosted UI). */
  loginAws(destino = '/'): void {
    void this.cognito.login(destino);
  }

  /** Cierra la sesión en el navegador y en el proveedor con el que se entró. */
  logout(): void {
    if (this.proveedor() === 'cognito') {
      void this.cognito.logout();
      return;
    }
    this.msal.logoutRedirect({
      account: this.msal.instance.getActiveAccount() ?? undefined,
    });
  }

  /** Comprueba un App Role leído desde los claims del token. */
  tieneRol(rol: string): boolean {
    return this.roles().includes(rol);
  }

  /** Roles del usuario, esperando a que MSAL termine el login y cargue el token. */
  asegurarRoles(): Observable<string[]> {
    if (this.cognito.autenticado()) {
      return of(this.cognito.grupos());
    }
    return this.broadcast.inProgress$.pipe(
      filter((estado) => estado === InteractionStatus.None),
      take(1),
      switchMap(() => {
        if (this.roles().length > 0) {
          return of(this.roles());
        }
        const cuenta =
          this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0] ?? null;
        if (!cuenta) {
          return of([]);
        }
        this._cuenta.set(cuenta);
        return this.msal
          .acquireTokenSilent({ scopes: [...environment.api.scopes], account: cuenta })
          .pipe(
            map((resultado) => {
              this._accessToken.set(resultado.accessToken);
              return this.roles();
            }),
            catchError(() => of(this.roles())),
          );
      }),
    );
  }

  /**
   * Fuerza la obtención de un access token válido. MSAL lo devuelve desde
   * caché y lo renueva de forma silenciosa cuando está por expirar.
   */
  refrescarAccessToken(): void {
    const cuenta = this.msal.instance.getActiveAccount();
    if (!cuenta) {
      this._accessToken.set(null);
      return;
    }

    this.msal
      .acquireTokenSilent({ scopes: [...environment.api.scopes], account: cuenta })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resultado) => this._accessToken.set(resultado.accessToken),
        error: (error: unknown) => {
          console.warn('[Auth] No se pudo renovar el token en silencio', error);
          this._accessToken.set(null);
        },
      });
  }

  private sincronizarCuenta(): void {
    const activa =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0] ?? null;

    if (activa) {
      this.msal.instance.setActiveAccount(activa);
    }

    this._cuenta.set(activa);

    if (activa) {
      this.refrescarAccessToken();
    } else {
      this._accessToken.set(null);
    }
  }
}
