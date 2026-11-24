import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Metricas, Recomendacion } from '../models/analytics.model';

/** Consume ms-analytics-recommendations a través del API Gateway. */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.analytics}`;

  recomendaciones(limite = 4): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.base}/recomendaciones`, { params: { limite } });
  }

  /** Carga inicial del dashboard; luego las métricas llegan por WebSocket. */
  metricas(): Observable<Metricas> {
    return this.http.get<Metricas>(`${this.base}/metricas`);
  }
}
