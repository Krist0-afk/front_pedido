import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { environment } from '../../../environments/environment';
import { UsuarioBackend } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sincronizar realiza POST a /sincronizar y devuelve el usuario de PostgreSQL', () => {
    const usuarioFalso: UsuarioBackend = {
      id: 99,
      nombre: 'Gustavo Developer',
      correo: 'gustavo@cloudnative.cl',
    };

    service.sincronizar().subscribe((u) => {
      expect(u.id).toBe(99);
      expect(u.nombre).toBe('Gustavo Developer');
      expect(u.correo).toBe('gustavo@cloudnative.cl');
    });

    const req = httpMock.expectOne(`${environment.api.baseUrl}${environment.api.usuarios}/sincronizar`);
    expect(req.request.method).toBe('POST');
    req.flush(usuarioFalso);
  });
});
