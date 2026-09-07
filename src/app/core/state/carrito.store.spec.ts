import { TestBed } from '@angular/core/testing';
import { ProductoVista } from '../models/producto.model';
import { CarritoStore } from './carrito.store';

function producto(id: string, price: number): ProductoVista {
  return {
    id,
    name: `Producto ${id}`,
    description: 'Descripción de prueba',
    price,
    image: 'https://example.test/imagen.jpg',
    category: 'Hamburguesas',
    mode: 'restaurantes',
    rating: 4.5,
    reviewsCount: '10',
    prepTime: '25-35 min',
  };
}

describe('CarritoStore', () => {
  let store: CarritoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CarritoStore);
  });

  it('empieza vacío y sin cobros', () => {
    expect(store.items()).toEqual([]);
    expect(store.subtotal()).toBe(0);
    expect(store.costoEnvio()).toBe(0);
    expect(store.tarifaServicio()).toBe(0);
    expect(store.total()).toBe(0);
  });

  it('acumula cantidad al agregar dos veces el mismo producto', () => {
    const burger = producto('prod-1', 7990);
    store.agregar(burger);
    store.agregar(burger);

    expect(store.items().length).toBe(1);
    expect(store.cantidadDe('prod-1')).toBe(2);
    expect(store.subtotal()).toBe(15980);
  });

  it('cobra envío y tarifa de servicio bajo el umbral de envío gratis', () => {
    store.agregar(producto('prod-1', 10000));

    expect(store.costoEnvio()).toBe(1990);
    expect(store.tarifaServicio()).toBe(300);
    expect(store.total()).toBe(12290);
    expect(store.faltaParaEnvioGratis()).toBe(10000);
    expect(store.progresoEnvioGratis()).toBe(50);
  });

  it('libera el envío al alcanzar el umbral', () => {
    store.agregar(producto('prod-1', 20000));

    expect(store.costoEnvio()).toBe(0);
    expect(store.faltaParaEnvioGratis()).toBe(0);
    expect(store.progresoEnvioGratis()).toBe(100);
    expect(store.total()).toBe(20600);
  });

  it('no deja el progreso sobre 100% cuando se supera el umbral', () => {
    store.agregar(producto('prod-1', 50000));

    expect(store.progresoEnvioGratis()).toBe(100);
  });

  it('elimina la línea al bajar la cantidad a cero', () => {
    store.agregar(producto('prod-1', 5000));
    store.actualizarCantidad('prod-1', 0);

    expect(store.items()).toEqual([]);
  });

  it('vacía la canasta después de confirmar un pedido', () => {
    store.agregar(producto('prod-1', 5000));
    store.agregar(producto('prod-2', 3000));
    store.vaciar();

    expect(store.items()).toEqual([]);
    expect(store.cantidadTotal()).toBe(0);
  });
});
