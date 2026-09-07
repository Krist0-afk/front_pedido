/** Espeja la entidad `Producto` del microservicio catálogo. */
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export type ModoCatalogo = 'restaurantes' | 'supermercado';

/**
 * Producto tal como lo pinta la interfaz.
 *
 * El backend solo entrega id/nombre/precio/stock, así que los campos de
 * presentación (imagen, rating, tiempo de preparación) se completan desde el
 * catálogo de demostración. `origen` distingue de dónde salió cada tarjeta.
 */
export interface ProductoVista {
  id: string;
  name: string;
  description: string;
  price: number;
  refUsd?: string;
  image: string;
  category: string;
  mode: ModoCatalogo;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'warning';
  rating: number;
  reviewsCount: string;
  prepTime: string;
  portionOrCalories?: string;
  packInfo?: string;
  storeName?: string;
  /** `api` = vino del microservicio; `demo` = catálogo local de respaldo. */
  origen?: 'api' | 'demo';
  /** Id numérico del backend, necesario para crear el pedido en compras. */
  productoId?: number;
  stock?: number;
}

export interface ItemCarrito {
  product: ProductoVista;
  quantity: number;
  notes?: string;
}

export interface Direccion {
  id: string;
  tag: 'home' | 'work' | 'other';
  label: string;
  street: string;
  number: string;
  depto?: string;
  floor?: string;
  commune: string;
  city: string;
  reference?: string;
  isDefault: boolean;
  courierInstructions?: string;
}
