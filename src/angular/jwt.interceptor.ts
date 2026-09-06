/**
 * Angular HTTP Interceptor for AWS API Gateway with JWT Bearer Token.
 * Compatible with modern Angular 17+ (provideHttpClient with withInterceptors)
 * and classic Angular HttpInterceptor class.
 */

export const jwtInterceptorCode = `
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

/**
 * Functional Interceptor for Angular 15+ / 17+ / 18+
 * Injects Authorization: Bearer <token> into every outgoing AWS HTTP request
 */
export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clone request with Authorization header if JWT token is present
  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: \`Bearer \${token}\`,
        'X-Client-Platform': 'Angular-Pedidos360-Web',
        'Content-Type': 'application/json'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid against AWS Cognito / Custom Authorizer
        console.warn('[JWT Interceptor] AWS Session expired (401). Logging out...');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
`;
