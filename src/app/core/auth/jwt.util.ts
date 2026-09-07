/**
 * Decodifica el payload de un JWT para inspeccionar sus claims en el cliente.
 *
 * Es solo lectura para efectos de UI: la validación real de firma, `iss`,
 * `aud` y `exp` la hacen el AWS API Gateway y los microservicios Spring Boot.
 * Nunca se debe confiar en estos valores para tomar decisiones de seguridad
 * en el servidor.
 */
export function decodificarJwt(token: string | null): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const partes = token.split('.');
  if (partes.length !== 3) {
    return null;
  }

  try {
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const relleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(relleno)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Convierte un claim numérico de tipo `exp` / `iat` a fecha legible. */
export function claimAFecha(valor: unknown): Date | null {
  return typeof valor === 'number' ? new Date(valor * 1000) : null;
}
