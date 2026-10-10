/**
 * Espeja la entidad `Usuario` del microservicio backend-usuario (PostgreSQL).
 */
export interface UsuarioBackend {
  id: number;
  nombre: string;
  correo: string;
}
