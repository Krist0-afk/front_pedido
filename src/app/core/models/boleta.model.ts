/**
 * Espeja la entidad `Boleta` del microservicio backend-facturacion.
 */
export interface Boleta {
  id: number;
  folioSii: string;
  ordenId: number;
  usuarioEmail: string;
  montoNeto: number;
  iva: number;
  montoTotal: number;
  /** `EMITIDA` o `ANULADA`. */
  estado: string;
  fechaEmision: string;
}
