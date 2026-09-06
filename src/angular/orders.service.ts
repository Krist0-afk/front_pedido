/**
 * Angular Orders Service for AWS API Gateway / Lambda
 * Connects checkout and order tracking with JWT authentication
 */

export const ordersServiceCode = `
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { OrderCheckoutDto, OrderResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);

  /**
   * Submit complete checkout order to AWS endpoint.
   * Authorization: Bearer <jwt> is automatically added by jwtInterceptor.
   */
  createOrder(orderData: OrderCheckoutDto): Observable<OrderResponse> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.orders.checkout}\`;
    return this.http.post<OrderResponse>(url, orderData);
  }

  /**
   * Get historical orders for current authenticated user
   */
  getOrderHistory(): Observable<OrderResponse[]> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.orders.list}\`;
    return this.http.get<OrderResponse[]>(url);
  }

  /**
   * Real-time GPS status for active order
   */
  trackOrder(orderId: string): Observable<{ status: string; courierLat: number; courierLng: number; etaMinutes: number }> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.orders.track(orderId)}\`;
    return this.http.get<any>(url);
  }
}
`;
