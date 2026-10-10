import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Orden } from '../models/orden.model';

/**
 * Consume el microservicio Backend-cloud-ordenes a través del AWS API Gateway.
 *
 * Requiere el App Role `User`. Orquesta la conversión de los ítems del carrito
 * en una orden persistida en PostgreSQL y publica el evento en RabbitMQ para
 * que el microservicio de notificaciones emita el comprobante.
 */
@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.ordenes}`;

  /**
   * Completa una orden a partir de los ítems existentes en el carrito
   * del microservicio de compras.
   */
  completarOrden(): Observable<Orden> {
    return this.http.post<Orden>(`${this.base}/completar`, {});
  }

  /**
   * Obtiene la lista de órdenes creadas por el usuario autenticado.
   */
  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.base);
  }
}
