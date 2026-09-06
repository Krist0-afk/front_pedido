// Angular Models for Pedidos 360 & AWS Integration
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rut: string;
  phone: string;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  user: UserProfile;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  mode: 'restaurantes' | 'supermercado';
  badge?: string;
  rating: number;
  reviewsCount: string;
  prepTime: string;
  storeName?: string;
}

export interface CartItemDto {
  productId: string;
  quantity: number;
  notes?: string;
  unitPrice: number;
}

export interface OrderCheckoutDto {
  items: CartItemDto[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tip: number;
  total: number;
  couponCode?: string;
  deliveryAddress: {
    street: string;
    number: string;
    depto?: string;
    commune: string;
    city: string;
    instructions?: string;
  };
  billingRut: string;
  contactPhone: string;
  paymentMethod: 'webpay' | 'wallets' | 'cash';
}

export interface OrderResponse {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED';
  estimatedDeliveryTime: string;
  trackingUrl: string;
  createdAt: string;
}
