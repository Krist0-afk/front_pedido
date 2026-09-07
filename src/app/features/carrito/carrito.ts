import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { DIRECCIONES_DEMO } from '../../core/data/catalogo-demo';
import { Pedido } from '../../core/models/pedido.model';
import { ComprasService } from '../../core/services/compras.service';
import { describirError } from '../../core/services/http-error.util';
import { CarritoStore } from '../../core/state/carrito.store';
import { UiStore } from '../../core/state/ui.store';
import { Icon } from '../../shared/icon/icon';

type MedioDePago = 'webpay' | 'wallets' | 'cash';

@Component({
  selector: 'app-carrito',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink, Icon],
  templateUrl: './carrito.html',
})
export class Carrito {
  protected readonly carrito = inject(CarritoStore);
  protected readonly auth = inject(AuthService);
  private readonly compras = inject(ComprasService);
  private readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  protected readonly direcciones = DIRECCIONES_DEMO;
  protected readonly direccionId = signal(DIRECCIONES_DEMO[0].id);
  protected readonly medioDePago = signal<MedioDePago>('webpay');

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly apiSinConfigurar = environment.api.baseUrl.includes('REEMPLAZAR');

  protected seleccionarDireccion(id: string): void {
    this.direccionId.set(id);
  }

  /**
   * Envía cada línea del carrito al microservicio de compras.
   *
   * El backend exige el App Role `User` y resuelve el propietario desde el
   * claim del JWT, así que aquí solo viajan producto, cantidad y total.
   */
  protected confirmarPedido(): void {
    const items = this.carrito.items();
    if (items.length === 0) return;

    if (this.apiSinConfigurar) {
      this.error.set(
        'El API Gateway todavía no está configurado: reemplaza api.baseUrl en src/environments/ para enviar el pedido al microservicio de compras.',
      );
      return;
    }

    const pedidos: Pedido[] = items
      .filter((item) => item.product.productoId !== undefined)
      .map((item) => ({
        productoId: item.product.productoId!,
        cantidad: item.quantity,
        total: item.product.price * item.quantity,
      }));

    if (pedidos.length === 0) {
      this.error.set(
        'Los productos de la canasta provienen del catálogo local de demostración y no tienen id del backend. Carga el catálogo desde el microservicio para poder comprarlos.',
      );
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    forkJoin(pedidos.map((pedido) => this.compras.agregarAlCarrito(pedido))).subscribe({
      next: () => {
        this.enviando.set(false);
        this.carrito.vaciar();
        this.ui.avisar('🎉 ¡Pedido recibido! Tu repartidor ya está en camino.');
        this.router.navigate(['/']);
      },
      error: (e: unknown) => {
        this.enviando.set(false);
        this.error.set(describirError(e));
      },
    });
  }
}
