import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { InicioWebpay, Pago, PagoRequest } from '../models/pago.model';

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

  /** Inicia el pago en Webpay Plus: devuelve el token y la URL del formulario de Transbank. */
  iniciarWebpay(ordenId: number, monto: number): Observable<InicioWebpay> {
    return this.http.post<InicioWebpay>(`${this.base}/webpay`, { ordenId, monto });
  }

  /**
   * Envía al cliente al formulario de Webpay. Transbank exige un POST con el campo token_ws;
   * al terminar, devuelve al cliente a ms-pago, que confirma y redirige a /ordenes.
   */
  irAWebpay(inicio: InicioWebpay): void {
    const formulario = document.createElement('form');
    formulario.method = 'POST';
    formulario.action = inicio.url;
    const campo = document.createElement('input');
    campo.type = 'hidden';
    campo.name = 'token_ws';
    campo.value = inicio.token;
    formulario.appendChild(campo);
    document.body.appendChild(formulario);
    formulario.submit();
  }

  misPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.base}/mios`);
  }
}
