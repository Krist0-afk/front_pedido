import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce el error HTTP a un mensaje que explica dónde está el problema en la
 * cadena frontend -> API Gateway -> microservicio.
 */
export function describirError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Error inesperado al llamar al backend.';
  }

  switch (error.status) {
    case 0:
      return 'No hubo respuesta del API Gateway. Revisa el invoke URL y que CORS permita este origen (incluido el preflight OPTIONS).';
    case 401:
      return 'El token fue rechazado (401). Puede estar expirado, o el issuer/audience no coincide con lo que valida el API Gateway.';
    case 403:
      return 'Token válido pero sin permisos (403). Lo rechaza el authorizer del '
        + 'API Gateway por los authorization scopes de la ruta, o el microservicio '
        + 'por el App Role. Compara el claim scp y roles del token en /perfil.';
    case 404:
      return 'La ruta no existe en el API Gateway (404). Revisa el mapeo hacia el microservicio.';
    case 502:
    case 503:
    case 504:
      return `El API Gateway no pudo alcanzar el microservicio (${error.status}). Verifica que la instancia EC2 esté activa.`;
    default:
      return `El backend respondió ${error.status}. ${error.message}`;
  }
}
