import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Pago, PagoRequest } from '../models/pago.model';

/**
 * Consume ms-pago a través del API Gateway. El backend responde 201 (aprobado),
 * 402 (rechazado) o 403 (bloqueado por antifraude); los dos últimos traen el pago en el cuerpo.
 */
@Injectable({ providedIn: 'root' })
export class PagosService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.pagos}`;

  pagar(request: PagoRequest): Observable<Pago> {
    return this.http.post<Pago>(this.base, request);
  }

  misPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.base}/mios`);
  }
}
