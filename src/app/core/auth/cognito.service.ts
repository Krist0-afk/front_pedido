import { Injectable, computed, signal } from '@angular/core';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

import { environment } from '../../../environments/environment';
import { decodificarJwt } from './jwt.util';

/**
 * Login con AWS Cognito (Hosted UI, Authorization Code + PKCE).
 * Al API Gateway se envía el ID token, que trae el correo y `cognito:groups`.
 */
@Injectable({ providedIn: 'root' })
export class CognitoService {
  private readonly manager = new UserManager({
    authority: environment.cognito.authority,
    client_id: environment.cognito.clientId,
    redirect_uri: environment.cognito.redirectUri,
    post_logout_redirect_uri: environment.cognito.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true,
  });

  private readonly _usuario = signal<User | null>(null);

  readonly autenticado = computed(() => {
    const usuario = this._usuario();
    return usuario !== null && !usuario.expired;
  });

  /** Token que viaja al API Gateway. */
  readonly idToken = computed(() => (this.autenticado() ? (this._usuario()?.id_token ?? null) : null));

  readonly claims = computed<Record<string, unknown>>(() => decodificarJwt(this.idToken()) ?? {});

  /** Grupos del User Pool: equivalen a los App Roles de Entra ID. */
  readonly grupos = computed<string[]>(() => {
    const grupos = this.claims()['cognito:groups'];
    return Array.isArray(grupos) ? (grupos as string[]) : [];
  });

  constructor() {
    this.manager.events.addUserLoaded((usuario) => this._usuario.set(usuario));
    this.manager.events.addUserUnloaded(() => this._usuario.set(null));
  }

  /** Al arrancar: completa el login si se vuelve de Cognito con `?code=`, o recupera la sesión. */
  async inicializar(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') && params.has('state')) {
      try {
        const usuario = await this.manager.signinRedirectCallback();
        this._usuario.set(usuario);
        const destino = typeof usuario.state === 'string' ? usuario.state : '/';
        window.history.replaceState({}, '', destino);
        return;
      } catch (error) {
        console.error('[Cognito] No se pudo completar el login', error);
        window.history.replaceState({}, '', '/');
      }
    }
    this._usuario.set(await this.manager.getUser());
  }

  /** `destino`: ruta a la que se vuelve después del login. */
  login(destino = '/'): Promise<void> {
    return this.manager.signinRedirect({ state: destino });
  }

  /** Cognito no tiene end_session_endpoint, se usa su /logout. */
  async logout(): Promise<void> {
    await this.manager.removeUser();
    const url = new URL('/logout', environment.cognito.dominio);
    url.searchParams.set('client_id', environment.cognito.clientId);
    url.searchParams.set('logout_uri', environment.cognito.redirectUri);
    window.location.assign(url.toString());
  }
}
