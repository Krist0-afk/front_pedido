// Desarrollo local: proxy.conf.json reenvía /api/v1/* a los microservicios en localhost
export const environment = {
  production: false,

  msal: {
    clientId: 'c6445b4c-7863-42ac-a620-2fa3b5ea58d8',
    tenantId: '8ea291c8-4670-4598-8f0f-b5e216b5b755',
    authority: 'https://login.microsoftonline.com/8ea291c8-4670-4598-8f0f-b5e216b5b755',
    redirectUri: `${window.location.origin}/`,
    postLogoutRedirectUri: `${window.location.origin}/`,
  },

  api: {
    baseUrl: 'http://localhost:4200',
    catalogo: '/api/v1/catalogo',
    compras: '/api/v1/compras',
    ordenes: '/api/v1/ordenes',
    usuarios: '/api/v1/usuarios',
    facturacion: '/api/v1/facturacion',
    pagos: '/api/v1/pagos',
    analytics: '/api/v1/analytics',
    kafkaAdmin: '/api/v1/kafka-admin',

    scopes: ['api://c6445b4c-7863-42ac-a620-2fa3b5ea58d8/desarrollo/wri&rea'],
  },

  cognito: {
    authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_GrYPmcDNr',
    clientId: '60r3m35l2uqmmlfk5r1j5unhmo',
    dominio: 'https://pedidos360-ac0fac.auth.us-east-1.amazoncognito.com',
    redirectUri: `${window.location.origin}/`,
    prefijoApi: '/cognito',
  },

  analyticsWs: '/api/v1/analytics/ws',

  rolCompras: 'User',
  rolAdmin: 'Admin',
};
