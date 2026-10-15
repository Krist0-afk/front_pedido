import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CognitoService } from './cognito.service';

/**
 * Con sesión de Cognito las llamadas van a `/cognito/api/v1/...` con el ID token.
 * Así el MsalInterceptor (que corre después) no reconoce la URL y no pide token de Entra ID.
 */
export const cognitoInterceptor: HttpInterceptorFn = (req, next) => {
  const cognito = inject(CognitoService);
  const token = cognito.idToken();
  const base = `${environment.api.baseUrl}/api/v1/`;

  if (!token || !req.url.startsWith(base)) {
    return next(req);
  }

  return next(
    req.clone({
      url: req.url.replace(base, `${environment.api.baseUrl}${environment.cognito.prefijoApi}/api/v1/`),
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
