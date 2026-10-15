import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalGuard, MsalService } from '@azure/msal-angular';
import { map } from 'rxjs';

import { AuthService } from './auth.service';
import { CognitoService } from './cognito.service';

/**
 * Protege las rutas que exigen sesión iniciada (Microsoft o AWS).
 * Sin sesión manda a /ingresar, recordando la ruta de destino.
 */
export const autenticacionGuard: CanActivateFn = (route, state) => {
  if (inject(CognitoService).autenticado()) {
    return true;
  }
  if (inject(MsalService).instance.getAllAccounts().length > 0) {
    return inject(MsalGuard).canActivate(route, state);
  }
  return inject(Router).createUrlTree(['/ingresar'], { queryParams: { destino: state.url } });
};

/**
 * Protege las rutas que además exigen un App Role concreto.
 *
 * El rol se lee desde los claims del token (Entra ID o Cognito), de modo que
 * el frontend refleja la misma regla que aplica el microservicio de compras
 * con `.hasRole("User")`. La decisión de seguridad real sigue siendo del
 * backend: esto solo evita mostrar una vista que devolvería 403.
 */
export function rolGuard(rol: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    // Recién vuelto del login el token todavía no está cargado
    return auth
      .asegurarRoles()
      .pipe(
        map((roles) =>
          roles.includes(rol)
            ? true
            : router.createUrlTree(['/no-autorizado'], { queryParams: { rol } }),
        ),
      );
  };
}
