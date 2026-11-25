import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pedido } from '../models/pedido.model';

/**
 * Consume el microservicio de compras a través del AWS API Gateway.
 *
 * El backend exige el App Role `User` y deriva el propietario del pedido
 * desde el claim del JWT, no desde el cuerpo de la petición.
 */
@Injectable({ providedIn: 'root' })
export class ComprasService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.compras}`;

  /** Pedidos del usuario autenticado. */
  verCarrito(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.base}/carrito`);
  }

  /** Agrega un pedido al carrito del usuario autenticado. */
  agregarAlCarrito(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.base}/carrito`, pedido);
  }

  /** Quita un ítem del carrito (publica CARRITO_QUITADO en Kafka). */
  quitarDelCarrito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/carrito/${id}`);
  }

  /** Avisa que se sacó un producto de la canasta local (publica CARRITO_QUITADO en Kafka). */
  notificarQuitado(productoId: number, cantidad: number, valor: number): Observable<void> {
    return this.http.post<void>(`${this.base}/carrito/quitado`, { productoId, cantidad, valor });
  }

  /** Valida un cupón (publica CUPON_APLICADO en Kafka). */
  aplicarCupon(codigo: string, subtotal: number): Observable<CuponRespuesta> {
    return this.http.post<CuponRespuesta>(`${this.base}/cupon`, { codigo, subtotal });
  }

  /** Calcula el costo de despacho (publica ENVIO_CALCULADO en Kafka). */
  calcularEnvio(comuna: string, subtotal: number): Observable<EnvioRespuesta> {
    return this.http.post<EnvioRespuesta>(`${this.base}/envio`, { comuna, subtotal });
  }

  /** Elimina los pedidos pendientes del usuario autenticado. */
  vaciarCarrito(): Observable<void> {
    return this.http.delete<void>(`${this.base}/carrito`);
  }
}

export interface CuponRespuesta {
  codigo: string;
  valido: boolean;
  porcentaje: number;
  descuento: number;
  mensaje: string;
}

export interface EnvioRespuesta {
  comuna: string;
  costo: number;
  gratis: boolean;
  plazo: string;
}
