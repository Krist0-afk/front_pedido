/** Producto sugerido por ms-analytics-recommendations. */
export interface Recomendacion {
  productoId: number;
  nombre: string;
  categoria: string;
  precio: number;
  motivo: string;
  puntaje: number;
}

export interface AlertaFraude {
  ordenId: number;
  tarjeta: string;
  usuario: string;
  motivo: string;
  hora: string;
}

/** Métricas en tiempo real que llegan por WebSocket (/topic/metricas). */
export interface Metricas {
  clicsPorMinuto: { minuto: string; total: number }[];
  productosMasVistos: { productoId: number; nombre: string; vistas: number }[];
  eventosPorTipo: Record<string, number>;
  pagos: { aprobados: number; rechazados: number; bloqueados: number; montoAprobado: number };
  alertasFraude: AlertaFraude[];
  usuariosActivos: number;
  totalEventos: number;
  actualizado: string;
}
