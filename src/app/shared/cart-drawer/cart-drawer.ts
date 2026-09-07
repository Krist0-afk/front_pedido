import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCarrito } from '../../core/models/producto.model';
import { CarritoStore } from '../../core/state/carrito.store';
import { UiStore } from '../../core/state/ui.store';
import { Icon } from '../icon/icon';

/** Panel lateral con el detalle de la canasta, accesible desde el header. */
@Component({
  selector: 'app-cart-drawer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, Icon],
  templateUrl: './cart-drawer.html',
})
export class CartDrawer {
  protected readonly carrito = inject(CarritoStore);
  protected readonly ui = inject(UiStore);
  private readonly router = inject(Router);

  protected idDe(_indice: number, item: ItemCarrito): string {
    return item.product.id;
  }

  protected irAPagar(): void {
    this.ui.cerrarCarrito();
    this.router.navigate(['/carrito']);
  }
}
