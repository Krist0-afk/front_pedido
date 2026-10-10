import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, take } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { UsuarioBackend } from '../../core/models/usuario.model';
import { describirError } from '../../core/services/http-error.util';
import { UsuarioService } from '../../core/services/usuario.service';
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
export class Perfil implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly msalBroadcast = inject(MsalBroadcastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly usuarioBackend = signal<UsuarioBackend | null>(null);
  protected readonly sincronizando = signal(false);
  protected readonly errorSincronizacion = signal<string | null>(null);

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

  ngOnInit(): void {
    // Espera a que MSAL termine para asegurar token y cuenta activa
    this.msalBroadcast.inProgress$
      .pipe(
        filter((estado) => estado === InteractionStatus.None),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.auth.autenticado()) {
          this.sincronizarConBackend();
        }
      });
  }

  protected sincronizarConBackend(): void {
    this.sincronizando.set(true);
    this.errorSincronizacion.set(null);

    this.usuarioService.sincronizar().subscribe({
      next: (usuario) => {
        this.usuarioBackend.set(usuario);
        this.sincronizando.set(false);
      },
      error: (e: unknown) => {
        this.sincronizando.set(false);
        this.errorSincronizacion.set(describirError(e));
      },
    });
  }

  protected cerrarSesion(): void {
    this.auth.logout();
  }
}
