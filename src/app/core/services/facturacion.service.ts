import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Boleta } from '../models/boleta.model';

/**
 * Consume el microservicio backend-facturacion a través del AWS API Gateway.
 */
@Injectable({ providedIn: 'root' })
export class FacturacionService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.facturacion}`;

  /** Boletas del usuario autenticado. */
  obtenerMisBoletas(): Observable<Boleta[]> {
    return this.http.get<Boleta[]>(`${this.base}/boletas/mias`);
  }
}
