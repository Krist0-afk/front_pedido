// Angular Environment Configuration for AWS API Gateway / Lambda & JWT
export const environment = {
  production: false,
  // Base endpoint for AWS API Gateway / Serverless backend
  awsApiUrl: 'https://api.pedidos360.aws.example.com/v1',
  awsRegion: 'us-east-1',
  // Endpoints definitions
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refreshToken: '/auth/refresh',
      profile: '/user/profile'
    },
    products: {
      list: '/products',
      detail: (id: string) => `/products/${id}`,
      categories: '/products/categories'
    },
    cart: {
      sync: '/cart/sync',
      validateCoupon: '/cart/validate-coupon'
    },
    orders: {
      checkout: '/orders/checkout',
      list: '/orders/history',
      track: (orderId: string) => `/orders/${orderId}/track`
    }
  }
};
