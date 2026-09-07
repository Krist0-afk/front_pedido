import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-no-autorizado',
  imports: [RouterLink],
  templateUrl: './no-autorizado.html',
})
export class NoAutorizado {
  protected readonly auth = inject(AuthService);

  /**
   * Rol exigido. Llega como query param desde el `rolGuard` y se enlaza
   * gracias a `withComponentInputBinding()`.
   */
  readonly rol = input('');
}
