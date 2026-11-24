export interface Topico {
  nombre: string;
  particiones: number;
  replicas: number;
}

export interface DetalleTopico {
  nombre: string;
  particiones: { particion: number; lider: number; replicas: number[]; enSincronia: number[] }[];
  configs: Record<string, string>;
}

export interface GrupoConsumidores {
  grupo: string;
  estado: string;
  miembros: number;
  lagTotal: number;
}

export interface DetalleGrupo {
  grupo: string;
  estado: string;
  coordinador: number;
  miembros: { consumidor: string; host: string; particiones: string[] }[];
  lagTotal: number;
  particiones: { topico: string; particion: number; offsetConfirmado: number; ultimoOffset: number; lag: number }[];
}

export interface CrearTopico {
  nombre: string;
  particiones: number;
  replicas: number;
  configs: Record<string, string>;
}
