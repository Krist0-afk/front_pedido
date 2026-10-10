import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioBackend } from '../models/usuario.model';

/**
 * Consume el microservicio backend-usuario a través del AWS API Gateway.
 *
 * Registra o sincroniza el perfil del usuario autenticado en la base de datos
 * PostgreSQL del microservicio y, si es nuevo, emite un evento a RabbitMQ.
 */
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.usuarios}`;

  /**
   * Sincroniza los datos del JWT con la base de datos de usuarios.
   */
  sincronizar(): Observable<UsuarioBackend> {
    return this.http.post<UsuarioBackend>(`${this.base}/sincronizar`, {});
  }
}
