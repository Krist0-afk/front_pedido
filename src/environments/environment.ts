/**
 * Configuración de PRODUCCIÓN.
 *
 * Los identificadores de Azure Entra ID (tenant, aplicación y scope) son los
 * mismos que consumen los microservicios Spring Boot para validar el JWT.
 */
export const environment = {
  production: true,

  msal: {
    /** Application (client) ID del registro de aplicación en el tenant. */
    clientId: 'c6445b4c-7863-42ac-a620-2fa3b5ea58d8',
    /** Directory (tenant) ID. */
    tenantId: '8ea291c8-4670-4598-8f0f-b5e216b5b755',
    /** Authority del tenant: emite los tokens y define el claim `iss`. */
    authority:
      'https://login.microsoftonline.com/8ea291c8-4670-4598-8f0f-b5e216b5b755',
    /** Debe estar registrada como Redirect URI (tipo SPA) en el portal. */
    redirectUri: 'https://TU-DOMINIO-DE-PRODUCCION',
    postLogoutRedirectUri: 'https://TU-DOMINIO-DE-PRODUCCION',
  },

  api: {
    /**
     * URL base del stage de AWS API Gateway.
     * TODO: reemplazar por el invoke URL real del API Manager.
     */
    baseUrl: 'https://REEMPLAZAR.execute-api.us-east-1.amazonaws.com/prod',
    /** Ruta del API Gateway que enruta al microservicio catálogo (EC2:8081). */
    catalogo: '/api/v1/catalogo',
    /** Ruta del API Gateway que enruta al microservicio compras (EC2:8082). */
    compras: '/api/v1/compras',
    /**
     * Scope expuesto por la API en el registro de aplicación.
     * Es lo que hace que Entra ID emita un access token cuyo `aud`
     * coincide con el que validan los microservicios.
     */
    scopes: ['api://c6445b4c-7863-42ac-a620-2fa3b5ea58d8/desarrollo'],
  },

  /** App Role exigido por el microservicio de compras (`.hasRole("User")`). */
  rolCompras: 'User',
};
