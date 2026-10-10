import { ProductoVista } from './producto.model';

/**
 * Espeja la entidad `OrdenItem` del microservicio Backend-cloud-ordenes.
 */
export interface OrdenItem {
  id?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

/**
 * Espeja la entidad `Orden` del microservicio Backend-cloud-ordenes.
 */
export interface Orden {
  id?: number;
  usuarioEmail: string;
  fecha: string;
  total: number;
  items: OrdenItem[];
}

/**
 * Orden enriquecida para la interfaz de usuario con los datos visuales
 * de los productos resueltos desde el catálogo (nombre, imagen, categoría).
 */
export interface OrdenItemVista extends OrdenItem {
  producto?: ProductoVista;
}

export interface OrdenVista extends Omit<Orden, 'items'> {
  items: OrdenItemVista[];
}
