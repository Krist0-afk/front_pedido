import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CrearTopico, DetalleGrupo, DetalleTopico, GrupoConsumidores, Topico } from '../models/kafka.model';

/** Consume ms-kafka-admin (solo rol Admin). */
@Injectable({ providedIn: 'root' })
export class KafkaAdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.kafkaAdmin}`;

  cluster(): Observable<{ clusterId: string; controlador: number; brokers: { id: number; host: string; puerto: number }[] }> {
    return this.http.get<{ clusterId: string; controlador: number; brokers: { id: number; host: string; puerto: number }[] }>(`${this.base}/cluster`);
  }

  topicos(): Observable<Topico[]> {
    return this.http.get<Topico[]>(`${this.base}/topics`);
  }

  topico(nombre: string): Observable<DetalleTopico> {
    return this.http.get<DetalleTopico>(`${this.base}/topics/${encodeURIComponent(nombre)}`);
  }

  crearTopico(topico: CrearTopico): Observable<unknown> {
    return this.http.post(`${this.base}/topics`, topico);
  }

  actualizarConfig(nombre: string, configs: Record<string, string>): Observable<unknown> {
    return this.http.put(`${this.base}/topics/${encodeURIComponent(nombre)}/config`, { configs });
  }

  aumentarParticiones(nombre: string, total: number): Observable<unknown> {
    return this.http.post(`${this.base}/topics/${encodeURIComponent(nombre)}/partitions`, { total });
  }

  eliminarTopico(nombre: string): Observable<unknown> {
    return this.http.delete(`${this.base}/topics/${encodeURIComponent(nombre)}`);
  }

  grupos(): Observable<GrupoConsumidores[]> {
    return this.http.get<GrupoConsumidores[]>(`${this.base}/consumer-groups`);
  }

  grupo(id: string): Observable<DetalleGrupo> {
    return this.http.get<DetalleGrupo>(`${this.base}/consumer-groups/${encodeURIComponent(id)}`);
  }

  resetearOffsets(grupo: string, topico: string, posicion: 'earliest' | 'latest'): Observable<unknown> {
    return this.http.post(`${this.base}/consumer-groups/${encodeURIComponent(grupo)}/reset`, { topico, posicion });
  }
}
