import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { environment } from '../../../environments/environment';
import { Orden } from '../models/orden.model';
import { OrdenesService } from './ordenes.service';

describe('OrdenesService', () => {
  let service: OrdenesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenesService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OrdenesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('completarOrden realiza POST a /completar y devuelve la orden creada', () => {
    const ordenFalsa: Orden = {
      id: 42,
      usuarioEmail: 'test@duocuc.cl',
      fecha: '2026-10-10T19:00:00',
      total: 12990,
      items: [{ id: 1, productoId: 101, cantidad: 1, precioUnitario: 12990 }],
    };

    service.completarOrden().subscribe((orden) => {
      expect(orden.id).toBe(42);
      expect(orden.total).toBe(12990);
      expect(orden.items.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.api.baseUrl}${environment.api.ordenes}/completar`);
    expect(req.request.method).toBe('POST');
    req.flush(ordenFalsa);
  });

  it('obtenerMisOrdenes realiza GET y devuelve la lista de órdenes', () => {
    const ordenesFalsas: Orden[] = [
      {
        id: 1,
        usuarioEmail: 'test@duocuc.cl',
        fecha: '2026-10-10T18:00:00',
        total: 5000,
        items: [],
      },
    ];

    service.obtenerMisOrdenes().subscribe((ordenes) => {
      expect(ordenes.length).toBe(1);
      expect(ordenes[0].id).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.api.baseUrl}${environment.api.ordenes}`);
    expect(req.request.method).toBe('GET');
    req.flush(ordenesFalsas);
  });
});
