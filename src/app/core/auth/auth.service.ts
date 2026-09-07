import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs';

import { environment } from '../../../environments/environment';
import { claimAFecha, decodificarJwt } from './jwt.util';

/**
 * Fachada sobre MSAL para el resto de la aplicación.
 *
 * Expone el estado de sesión como signals y centraliza la lectura de roles y
 * scopes desde los claims del token, para que los componentes no dependan
 * directamente de la API de MSAL.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msal = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _cuenta = signal<AccountInfo | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _estado = signal<InteractionStatus>(InteractionStatus.Startup);

  /** Cuenta activa devuelta por Entra ID, o `null` si no hay sesión. */
  readonly cuenta = this._cuenta.asReadonly();

  /** `true` mientras MSAL está resolviendo un login, logout o refresco. */
  readonly ocupado = computed(() => this._estado() !== InteractionStatus.None);

  readonly autenticado = computed(() => this._cuenta() !== null);
  readonly nombre = computed(() => this._cuenta()?.name ?? '');
  readonly email = computed(() => this._cuenta()?.username ?? '');

  /** Claims del ID token: identidad del usuario. */
  readonly idTokenClaims = computed<Record<string, unknown>>(
    () => (this._cuenta()?.idTokenClaims as Record<string, unknown> | undefined) ?? {},
  );

  /** Claims del access token: es el que viaja al API Gateway. */
  readonly accessTokenClaims = computed<Record<string, unknown>>(
    () => decodificarJwt(this._accessToken()) ?? {},
  );

  readonly accessToken = this._accessToken.asReadonly();

  /**
   * App Roles asignados al usuario. Entra ID los emite en el claim `roles`,
   * el mismo que los microservicios mapean a `ROLE_*` en Spring Security.
   */
  readonly roles = computed<string[]>(() => {
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

    // Cualquier evento de MSAL (login, adquisición de token, logout) puede
    // cambiar la cuenta activa o renovar el access token en caché.
    this.broadcast.msalSubject$
      .pipe(
        filter(() => this._estado() === InteractionStatus.None),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.sincronizarCuenta());
  }

  /** Inicia sesión con redirect (Authorization Code + PKCE). */
  login(): void {
    this.msal.loginRedirect({ scopes: [...environment.api.scopes] });
  }

  /** Cierra la sesión en el navegador y en el tenant de Entra ID. */
  logout(): void {
    this.msal.logoutRedirect({
      account: this.msal.instance.getActiveAccount() ?? undefined,
    });
  }

  /** Comprueba un App Role leído desde los claims del token. */
  tieneRol(rol: string): boolean {
    return this.roles().includes(rol);
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
