import {
  BrowserCacheLocation,
  IPublicClientApplication,
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';

import { environment } from '../../../environments/environment';

/**
 * Instancia de MSAL.
 *
 * MSAL Browser v3+ usa siempre el flujo OIDC "Authorization Code con PKCE"
 * para SPAs: genera el `code_verifier` / `code_challenge` y valida `state`
 * y `nonce` internamente. No existe configuración de flujo implícito.
 */
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msal.clientId,
      authority: environment.msal.authority,
      redirectUri: environment.msal.redirectUri,
      postLogoutRedirectUri: environment.msal.postLogoutRedirectUri,
    },
    cache: {
      // localStorage permite mantener la sesión entre pestañas y recargas.
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        logLevel: environment.production ? LogLevel.Error : LogLevel.Info,
        piiLoggingEnabled: false,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          if (level === LogLevel.Error) {
            console.error('[MSAL]', message);
          } else if (!environment.production) {
            console.log('[MSAL]', message);
          }
        },
      },
    },
  });
}

/**
 * Configuración del MsalGuard: qué hacer cuando se navega a una ruta
 * protegida sin sesión activa.
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.api.scopes],
    },
    loginFailedRoute: '/',
  };
}

/**
 * Configuración del MsalInterceptor.
 *
 * El mapa asocia cada recurso protegido con los scopes necesarios. Para cada
 * petición saliente que haga match, MSAL obtiene un access token (silencioso
 * si es posible) y lo adjunta como `Authorization: Bearer <token>`.
 *
 * Las URLs apuntan al AWS API Gateway, no directamente a las EC2: es el API
 * Manager quien valida el JWT antes de enrutar al microservicio.
 */
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string> | null>([
    [
      `${environment.api.baseUrl}${environment.api.catalogo}/*`,
      [...environment.api.scopes],
    ],
    [
      `${environment.api.baseUrl}${environment.api.compras}/*`,
      [...environment.api.scopes],
    ],
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
