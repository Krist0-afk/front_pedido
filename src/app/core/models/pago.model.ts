/** Datos que se envían al microservicio de pagos. El número de tarjeta no se guarda. */
export interface PagoRequest {
  ordenId: number;
  monto: number;
  numeroTarjeta: string;
  titular: string;
  vencimiento: string;
  cvv: string;
}

export type EstadoPago = 'APROBADO' | 'RECHAZADO' | 'BLOQUEADO_FRAUDE';

/** Espeja `PagoResponse` de ms-pago. */
export interface Pago {
  pagoId: number;
  ordenId: number;
  monto: number;
  ultimos4: string;
  estado: EstadoPago;
  motivo?: string | null;
  fecha: string;
}
