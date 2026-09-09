import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { Icon } from '../../shared/icon/icon';

/**
 * Qué habilita cada App Role, dicho en términos de la tienda. El usuario no
 * tiene por qué saber que detrás hay un claim `roles`.
 */
const PERMISOS: Record<string, string> = {
  User: 'Comprar y hacer seguimiento de tus pedidos',
  Admin: 'Administrar el catálogo de Pedidos 360',
};

@Component({
  selector: 'app-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, RouterLink],
  templateUrl: './perfil.html',
})
export class Perfil {
  protected readonly auth = inject(AuthService);

  protected readonly iniciales = computed(() =>
    this.auth
      .nombre()
      .split(' ')
      .filter((parte) => parte.length > 0)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join(''),
  );

  protected readonly permisos = computed(() =>
    this.auth.roles().map((rol) => PERMISOS[rol] ?? rol),
  );

  protected cerrarSesion(): void {
    this.auth.logout();
  }
}
