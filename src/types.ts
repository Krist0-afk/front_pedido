export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  refUsd?: string;
  image: string;
  category: string;
  mode: 'restaurantes' | 'supermercado';
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'warning';
  rating: number;
  reviewsCount: string;
  prepTime: string;
  portionOrCalories?: string;
  packInfo?: string;
  storeName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
  selectedModifiers?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  rut: string;
  phone: string;
  isVerified: boolean;
  provider?: 'google' | 'microsoft' | 'email';
  avatar?: string;
  token?: string;
  tokenExpiry?: string;
}

export interface DeliveryAddress {
  id: string;
  tag: 'home' | 'work' | 'other';
  label: string;
  street: string;
  number: string;
  depto?: string;
  floor?: string;
  commune: string;
  city: string;
  reference?: string;
  isDefault: boolean;
  courierInstructions?: string;
}

export type PaymentMethodType = 'webpay' | 'wallets' | 'cash';

export interface AWSConfig {
  endpoint: string;
  region: string;
  userPoolId?: string;
  clientId?: string;
  jwtToken: string;
  status: 'connected' | 'configured' | 'untested' | 'error';
}

export interface HttpRequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: any;
  status: number;
  response: any;
  durationMs: number;
}
