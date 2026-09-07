/** Espeja la entidad `Pedido` del microservicio compras. */
export interface Pedido {
  id?: number;
  productoId: number;
  cantidad: number;
  /** Lo asigna el backend desde el claim del JWT; no se envía desde el cliente. */
  usuarioEmail?: string;
  total: number;
}
