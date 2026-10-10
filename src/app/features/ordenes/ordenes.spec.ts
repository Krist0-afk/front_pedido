import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { AuthService } from '../../core/auth/auth.service';
import { Orden } from '../../core/models/orden.model';
import { CatalogoService } from '../../core/services/catalogo.service';
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

  TestBed.configureTestingModule({
    imports: [Ordenes],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: AuthService, useClass: AuthServiceFalso },
      { provide: MsalBroadcastService, useValue: { inProgress$: of(InteractionStatus.None) } },
      { provide: OrdenesService, useValue: ordenesMock },
      { provide: CatalogoService, useValue: catalogoMock },
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

  it('muestra mensaje de error cuando el microservicio falla', () => {
    const fixture = configurar(new Error('Fallo de conexión en backend'));
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('No se pudieron cargar las órdenes');
    expect(texto).toContain('Reintentar consulta');
  });
});
