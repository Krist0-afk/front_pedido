import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CATALOGO_DEMO } from '../data/catalogo-demo';
import { Producto, ProductoVista } from '../models/producto.model';

/**
 * Consume el microservicio de catálogo a través del AWS API Gateway.
 *
 * El `MsalInterceptor` adjunta automáticamente el header
 * `Authorization: Bearer <access_token>` a estas peticiones, porque la URL
 * base está declarada en el `protectedResourceMap`.
 */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.api.baseUrl}${environment.api.catalogo}`;

  /** `true` mientras el `baseUrl` siga con el marcador de plantilla. */
  readonly apiSinConfigurar = environment.api.baseUrl.includes('REEMPLAZAR');

  /** Endpoint abierto en el backend (`permitAll`), útil para contrastar. */
  listarPublico(): Observable<ProductoVista[]> {
    return this.http.get<Producto[]>(`${this.base}/public`).pipe(map((ps) => ps.map(aVista)));
  }

  /** Endpoint que exige un JWT válido en el backend. */
  listarPrivado(): Observable<ProductoVista[]> {
    return this.http.get<Producto[]>(`${this.base}/privado`).pipe(map((ps) => ps.map(aVista)));
  }
}

/**
 * Convierte el producto del backend (id/nombre/precio/stock) en la tarjeta que
 * pinta la interfaz. Los datos de presentación se toman del catálogo de
 * demostración cuando el nombre coincide; si no, se usa un aspecto genérico.
 */
function aVista(producto: Producto): ProductoVista {
  const nombre = producto.nombre?.trim() ?? '';
  const plantilla = CATALOGO_DEMO.find(
    (demo) => demo.name.toLowerCase() === nombre.toLowerCase(),
  );

  return {
    ...(plantilla ?? PLANTILLA_GENERICA),
    id: `api-${producto.id}`,
    productoId: producto.id,
    name: nombre || `Producto ${producto.id}`,
    price: producto.precio,
    stock: producto.stock,
    origen: 'api',
  };
}

const PLANTILLA_GENERICA: ProductoVista = {
  id: '',
  name: '',
  description: 'Producto disponible en el catálogo de Pedidos 360.',
  price: 0,
  image:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
  category: 'Todas',
  mode: 'restaurantes',
  rating: 4.7,
  reviewsCount: 'nuevo',
  prepTime: '25-35 min',
  storeName: 'Pedidos 360',
};
