export const environment = {
  production: true,

  msal: {
    /** Application (client) ID del registro de aplicación en el tenant. */
    clientId: 'c6445b4c-7863-42ac-a620-2fa3b5ea58d8',
    /** Directory (tenant) ID. */
    tenantId: '8ea291c8-4670-4598-8f0f-b5e216b5b755',
    /** Authority del tenant: emite los tokens. */
    authority:'https://login.microsoftonline.com/8ea291c8-4670-4598-8f0f-b5e216b5b755',
    redirectUri: `${window.location.origin}/`,
    postLogoutRedirectUri: `${window.location.origin}/`,
  },

  api: {
    // URL base del stage de AWS API Gateway. Sin barra final: las rutas de
    // abajo ya empiezan con `/`, y `host//api/...` no matchea en el Gateway.
    baseUrl: 'https://nub4p4p3ga.execute-api.us-east-1.amazonaws.com',
    // Ruta del API Gateway que enruta al microservicio catálogo (EC2:8081).
    catalogo: '/api/v1/catalogo',
    /** Ruta del API Gateway que enruta al microservicio compras (EC2:8082). */
    compras: '/api/v1/compras',
    /** Ruta del API Gateway que enruta al microservicio ordenes (EC2:8086). */
    ordenes: '/api/v1/ordenes',
    /** Ruta del API Gateway que enruta al microservicio usuarios (EC2:8084). */
    usuarios: '/api/v1/usuarios',
    /** Ruta del API Gateway que enruta al microservicio facturación (EC2:8087). */
    facturacion: '/api/v1/facturacion',
 
    scopes: ['api://c6445b4c-7863-42ac-a620-2fa3b5ea58d8/desarrollo/wri&rea'],
  },

  /** AWS Cognito: segundo proveedor de login (User Pool pedidos360-usuarios). */
  cognito: {
    authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_vZp9ZN52O',
    clientId: '348a4vr0o6i0ja8u5u7jes7tki',
    /** Dominio del Hosted UI (también se usa para el logout). */
    dominio: 'https://pedidos360-316121.auth.us-east-1.amazoncognito.com',
    redirectUri: `${window.location.origin}/`,
    /** Prefijo de las rutas del API Gateway protegidas por el autorizador de Cognito. */
    prefijoApi: '/cognito',
  },

  /** App Role exigido por el microservicio de compras (`.hasRole("User")`). */
  rolCompras: 'User',
};
