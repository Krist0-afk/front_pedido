/** Datos que se envían al microservicio de pagos. El número de tarjeta no se guarda. */
export interface PagoRequest {
  ordenId: number;
  monto: number;
  numeroTarjeta: string;
  titular: string;
  vencimiento: string;
  cvv: string;
}

export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'BLOQUEADO_FRAUDE';

/** Espeja `PagoResponse` de ms-pago. */
export interface Pago {
  pagoId: number;
  ordenId: number;
  monto: number;
  ultimos4: string;
  estado: EstadoPago;
  motivo?: string | null;
  fecha: string;
  metodo?: 'TARJETA' | 'WEBPAY';
}

/** Respuesta de ms-pago al iniciar un pago con Webpay Plus. */
export interface InicioWebpay {
  pagoId: number;
  token: string;
  url: string;
}
