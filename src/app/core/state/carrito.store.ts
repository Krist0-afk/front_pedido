import { Injectable, computed, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemCarrito, ProductoVista } from '../models/producto.model';

/** Umbral de despacho gratuito, en pesos. */
export const ENVIO_GRATIS_DESDE = 20000;
const COSTO_ENVIO = 1990;
const TARIFA_SERVICIO = 0.03;
const CLAVE_STORAGE = 'pedidos360.canasta';

/**
 * Estado del carrito, compartido entre el catálogo, el drawer y el checkout.
 *
 * Vive en el cliente (y en localStorage, para no perderlo al recargar): al
 * confirmar la orden se envía al microservicio de compras, que es quien la
 * persiste asociada al usuario del JWT.
 */
@Injectable({ providedIn: 'root' })
export class CarritoStore {
  private readonly _items = signal<ItemCarrito[]>(leerGuardado());
  readonly items = this._items.asReadonly();

  /** Ítems que el usuario sacó de la canasta (no incluye el vaciado al comprar). */
  readonly quitados = new Subject<ItemCarrito>();

  constructor() {
    effect(() => guardar(this._items()));
  }

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

  /** Máximo que se puede pedir según el stock (los productos demo no tienen límite). */
  limiteDe(producto: ProductoVista): number {
    return producto.stock ?? Number.POSITIVE_INFINITY;
  }

  agregar(producto: ProductoVista): void {
    if (this.cantidadDe(producto.id) >= this.limiteDe(producto)) return;
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
      items.map((item) =>
        item.product.id === productoId
          ? { ...item, quantity: Math.min(cantidad, this.limiteDe(item.product)) }
          : item,
      ),
    );
  }

  quitar(productoId: string): void {
    const quitado = this._items().find((item) => item.product.id === productoId);
    if (!quitado) return;
    this._items.update((items) => items.filter((item) => item.product.id !== productoId));
    this.quitados.next(quitado);
  }

  vaciar(): void {
    this._items.set([]);
  }
}

function leerGuardado(): ItemCarrito[] {
  try {
    const crudo = localStorage.getItem(CLAVE_STORAGE);
    const items: unknown = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(items)
      ? items.filter((i: ItemCarrito) => i?.product?.id && i.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

function guardar(items: ItemCarrito[]): void {
  try {
    if (items.length === 0) {
      localStorage.removeItem(CLAVE_STORAGE);
    } else {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
    }
  } catch {
    // Sin almacenamiento disponible (modo privado): la canasta queda solo en memoria
  }
}
