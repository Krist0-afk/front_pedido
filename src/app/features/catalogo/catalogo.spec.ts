import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CATALOGO_DEMO } from '../../core/data/catalogo-demo';
import { CatalogoService } from '../../core/services/catalogo.service';
import { CarritoStore } from '../../core/state/carrito.store';
import { Catalogo } from './catalogo';

/** Doble mínimo de AuthService: el catálogo solo consulta el estado de sesión. */
class AuthServiceFalso {
  readonly autenticadoSignal = signal(false);
  readonly autenticado = this.autenticadoSignal.asReadonly();
  readonly roles = signal<string[]>([]).asReadonly();
}

function configurar(catalogoApi: Partial<CatalogoService>) {
  TestBed.configureTestingModule({
    imports: [Catalogo],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([]),
      { provide: AuthService, useClass: AuthServiceFalso },
      // El componente espera a que MSAL termine el redirect antes de cargar.
      { provide: MsalBroadcastService, useValue: { inProgress$: of(InteractionStatus.None) } },
      { provide: CatalogoService, useValue: catalogoApi },
    ],
  });

  const fixture: ComponentFixture<Catalogo> = TestBed.createComponent(Catalogo);
  fixture.detectChanges();
  return fixture;
}

describe('Catalogo', () => {
  it('muestra el catálogo local cuando el API Gateway no está configurado', () => {
    const fixture = configurar({ apiSinConfigurar: true } as Partial<CatalogoService>);
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Burger 360 Doble Cheddar');
    expect(texto).toContain('Pizza Napolitana Familiar 360');
    expect(texto).toContain('Catálogo de demostración');
  });

  it('solo lista los productos del modo activo', () => {
    const fixture = configurar({ apiSinConfigurar: true } as Partial<CatalogoService>);
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';

    const deRestaurantes = CATALOGO_DEMO.filter((p) => p.mode === 'restaurantes');
    const deSupermercado = CATALOGO_DEMO.filter((p) => p.mode === 'supermercado');

    expect(deRestaurantes.every((p) => texto.includes(p.name))).toBe(true);
    expect(deSupermercado.some((p) => texto.includes(p.name))).toBe(false);
  });

  it('agrega un producto a la canasta', () => {
    const fixture = configurar({ apiSinConfigurar: true } as Partial<CatalogoService>);
    const carrito = TestBed.inject(CarritoStore);

    const botones = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    const anadir = Array.from(botones).find((b) => b.textContent?.includes('Añadir'));
    anadir?.dispatchEvent(new MouseEvent('click'));

    expect(carrito.cantidadTotal()).toBe(1);
  });

  it('usa el endpoint público cuando no hay sesión y hay API configurada', () => {
    const fixture = configurar({
      apiSinConfigurar: false,
      listarPublico: () => of([]),
      listarPrivado: () => of([]),
    } as Partial<CatalogoService>);

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('/catalogo/public');
  });

  it('avisa cuando el microservicio responde pero su catálogo está vacío', () => {
    const fixture = configurar({
      apiSinConfigurar: false,
      listarPublico: () => of([]),
      listarPrivado: () => of([]),
    } as Partial<CatalogoService>);

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('su catálogo está vacío');
    expect(texto).toContain('Burger 360 Doble Cheddar');
  });

  it('cae al catálogo local y avisa cuando el backend falla', () => {
    const fixture = configurar({
      apiSinConfigurar: false,
      listarPublico: () => throwError(() => new Error('caído')),
      listarPrivado: () => throwError(() => new Error('caído')),
    } as Partial<CatalogoService>);

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('No se pudo leer el catálogo');
    expect(texto).toContain('Burger 360 Doble Cheddar');
  });
});
