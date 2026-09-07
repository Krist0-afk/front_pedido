import { Injectable, computed, signal } from '@angular/core';
import { ItemCarrito, ProductoVista } from '../models/producto.model';

/** Umbral de despacho gratuito, en pesos. */
export const ENVIO_GRATIS_DESDE = 20000;
const COSTO_ENVIO = 1990;
const TARIFA_SERVICIO = 0.03;

/**
 * Estado del carrito, compartido entre el catálogo, el drawer y el checkout.
 *
 * Vive solo en el cliente: al confirmar la orden se envía al microservicio de
 * compras, que es quien la persiste asociada al usuario del JWT.
 */
@Injectable({ providedIn: 'root' })
export class CarritoStore {
  private readonly _items = signal<ItemCarrito[]>([]);
  readonly items = this._items.asReadonly();

  readonly cantidadTotal = computed(() =>
    this._items().reduce((acc, item) => acc + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this._items().reduce((acc, item) => acc + item.product.price * item.quantity, 0),
  );

  readonly costoEnvio = computed(() => {
    const subtotal = this.subtotal();
    if (subtotal === 0) return 0;
    return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  });

  readonly tarifaServicio = computed(() => Math.round(this.subtotal() * TARIFA_SERVICIO));

  readonly total = computed(() => this.subtotal() + this.costoEnvio() + this.tarifaServicio());

  readonly faltaParaEnvioGratis = computed(() =>
    Math.max(0, ENVIO_GRATIS_DESDE - this.subtotal()),
  );

  readonly progresoEnvioGratis = computed(() =>
    Math.min(100, Math.round((this.subtotal() / ENVIO_GRATIS_DESDE) * 100)),
  );

  cantidadDe(productoId: string): number {
    return this._items().find((item) => item.product.id === productoId)?.quantity ?? 0;
  }

  agregar(producto: ProductoVista): void {
    this._items.update((items) => {
      const existente = items.find((item) => item.product.id === producto.id);
      if (existente) {
        return items.map((item) =>
          item.product.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { product: producto, quantity: 1 }];
    });
  }

  actualizarCantidad(productoId: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(productoId);
      return;
    }
    this._items.update((items) =>
      items.map((item) => (item.product.id === productoId ? { ...item, quantity: cantidad } : item)),
    );
  }

  quitar(productoId: string): void {
    this._items.update((items) => items.filter((item) => item.product.id !== productoId));
  }

  vaciar(): void {
    this._items.set([]);
  }
}
