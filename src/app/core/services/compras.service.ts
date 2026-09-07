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
}
