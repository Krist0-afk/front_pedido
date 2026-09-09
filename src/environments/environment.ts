export const environment = {
  production: true,

  msal: {
    /** Application (client) ID del registro de aplicación en el tenant. */
    clientId: 'c6445b4c-7863-42ac-a620-2fa3b5ea58d8',
    /** Directory (tenant) ID. */
    tenantId: '8ea291c8-4670-4598-8f0f-b5e216b5b755',
    /** Authority del tenant: emite los tokens. */
    authority:'https://login.microsoftonline.com/8ea291c8-4670-4598-8f0f-b5e216b5b755',
    /** Debe estar registrada como Redirect URI (tipo SPA) en el portal. */
    redirectUri: 'https://3.213.91.126/',
    postLogoutRedirectUri: 'https://3.213.91.126/',
  },

  api: {
    // URL base del stage de AWS API Gateway. Sin barra final: las rutas de
    // abajo ya empiezan con `/`, y `host//api/...` no matchea en el Gateway.
    baseUrl: 'https://nub4p4p3ga.execute-api.us-east-1.amazonaws.com',
    // Ruta del API Gateway que enruta al microservicio catálogo (EC2:8081).
    catalogo: '/api/v1/catalogo',
    /** Ruta del API Gateway que enruta al microservicio compras (EC2:8082). */
    compras: '/api/v1/compras',
 
    scopes: ['api://c6445b4c-7863-42ac-a620-2fa3b5ea58d8/desarrollo'],
  },

  /** App Role exigido por el microservicio de compras (`.hasRole("User")`). */
  rolCompras: 'User',
};
