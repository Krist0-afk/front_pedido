import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';
import { Icon } from '../../shared/icon/icon';

/** Elección del proveedor de login: Microsoft (Entra ID) o AWS (Cognito). */
@Component({
  selector: 'app-ingresar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './ingresar.html',
})
export class Ingresar {
  protected readonly auth = inject(AuthService);

  /** Ruta a la que se vuelve después del login (query param `destino`). */
  readonly destino = input('/');

  protected conMicrosoft(): void {
    this.auth.login(this.destinoSeguro());
  }

  protected conAws(): void {
    this.auth.loginAws(this.destinoSeguro());
  }

  // Solo rutas internas, para no redirigir a otro sitio
  private destinoSeguro(): string {
    const destino = this.destino() || '/';
    return destino.startsWith('/') && !destino.startsWith('//') ? destino : '/';
  }
}
