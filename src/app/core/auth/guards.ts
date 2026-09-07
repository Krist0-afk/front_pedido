import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { AuthService } from './auth.service';

/**
 * Protege las rutas que exigen sesión iniciada.
 *
 * Delega en el `MsalGuard` de MSAL, que dispara el flujo de login por redirect
 * cuando no hay cuenta activa y conserva la URL de destino.
 */
export const autenticacionGuard: CanActivateFn = (route, state) =>
  inject(MsalGuard).canActivate(route, state);

/**
 * Protege las rutas que además exigen un App Role concreto.
 *
 * El rol se lee desde los claims del token emitido por Entra ID, de modo que
 * el frontend refleja la misma regla que aplica el microservicio de compras
 * con `.hasRole("User")`. La decisión de seguridad real sigue siendo del
 * backend: esto solo evita mostrar una vista que devolvería 403.
 */
export function rolGuard(rol: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.tieneRol(rol)) {
      return true;
    }

    return router.createUrlTree(['/no-autorizado'], { queryParams: { rol } });
  };
}
