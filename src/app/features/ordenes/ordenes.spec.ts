import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { AuthService } from '../../core/auth/auth.service';
import { Boleta } from '../../core/models/boleta.model';
import { Orden } from '../../core/models/orden.model';
import { CatalogoService } from '../../core/services/catalogo.service';
import { FacturacionService } from '../../core/services/facturacion.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { Ordenes } from './ordenes';

class AuthServiceFalso {
  autenticado = () => true;
  nombre = () => 'Gustavo Cloud';
  email = () => 'gustavo@cloudnative.cl';
  roles = () => ['User'];
}

function configurar(
  ordenesRespuesta: Orden[] | Error,
  catalogoRespuesta = [],
  boletasRespuesta: Boleta[] | Error = [],
) {
  const ordenesMock = {
    obtenerMisOrdenes: () =>
      ordenesRespuesta instanceof Error
        ? throwError(() => ordenesRespuesta)
        : of(ordenesRespuesta),
  };

  const catalogoMock = {
    obtenerCatalogo: () => of(catalogoRespuesta),
  };

  const facturacionMock = {
    obtenerMisBoletas: () =>
      boletasRespuesta instanceof Error
        ? throwError(() => boletasRespuesta)
        : of(boletasRespuesta),
  };

  TestBed.configureTestingModule({
    imports: [Ordenes],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: AuthService, useClass: AuthServiceFalso },
      { provide: MsalBroadcastService, useValue: { inProgress$: of(InteractionStatus.None) } },
      { provide: OrdenesService, useValue: ordenesMock },
      { provide: CatalogoService, useValue: catalogoMock },
      { provide: FacturacionService, useValue: facturacionMock },
    ],
  });

  const fixture: ComponentFixture<Ordenes> = TestBed.createComponent(Ordenes);
  fixture.detectChanges();
  return fixture;
}

describe('Ordenes', () => {
  it('muestra estado vacío cuando el usuario no tiene órdenes', () => {
    const fixture = configurar([]);
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Aún no tienes órdenes registradas');
    expect(texto).toContain('Explorar Catálogo');
  });

  it('renderiza la lista de órdenes cuando el microservicio responde', () => {
    const ordenesFalsas: Orden[] = [
      {
        id: 101,
        usuarioEmail: 'gustavo@cloudnative.cl',
        fecha: '2026-10-10T20:00:00',
        total: 15990,
        items: [
          {
            id: 1,
            productoId: 1,
            cantidad: 2,
            precioUnitario: 7995,
          },
        ],
      },
    ];

    const fixture = configurar(ordenesFalsas);
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Orden #101');
    expect(texto).toContain('RabbitMQ');
    expect(texto).toContain('Procesada');
  });

  it('muestra el detalle de la boleta consultado al microservicio de facturación', () => {
    const orden: Orden = {
      id: 7,
      usuarioEmail: 'gustavo@cloudnative.cl',
      fecha: '2026-10-10T20:00:00',
      total: 11900,
      folioBoleta: 'SII-39-ABC',
      items: [],
    };
    const boleta: Boleta = {
      id: 1,
      folioSii: 'SII-39-ABC',
      ordenId: 7,
      usuarioEmail: 'gustavo@cloudnative.cl',
      montoNeto: 10000,
      iva: 1900,
      montoTotal: 11900,
      estado: 'EMITIDA',
      fechaEmision: '2026-10-10T20:00:05',
    };

    const fixture = configurar([orden], [], [boleta]);
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('SII-39-ABC');
    expect(texto).toContain('EMITIDA');
    expect(texto).toMatch(/\$1[.,]900/);
    expect(texto).toMatch(/\$10[.,]000/);
  });

  it('muestra las órdenes aunque facturación no responda', () => {
    const orden: Orden = {
      id: 8,
      usuarioEmail: 'gustavo@cloudnative.cl',
      fecha: '2026-10-10T20:00:00',
      total: 5000,
      folioBoleta: 'SII-39-XYZ',
      items: [],
    };

    const fixture = configurar([orden], [], new Error('facturación caída'));
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Orden #8');
    expect(texto).toContain('SII-39-XYZ');
    expect(texto).toContain('facturación no respondió');
  });

  it('muestra mensaje de error cuando el microservicio falla', () => {
    const fixture = configurar(new Error('Fallo de conexión en backend'));
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('No se pudieron cargar las órdenes');
    expect(texto).toContain('Reintentar consulta');
  });
});
