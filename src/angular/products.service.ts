/**
 * Angular Products & Marketplace Service
 */

export const productsServiceCode = `
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from './environment';
import { ProductDto } from './models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache$?: Observable<ProductDto[]>;

  /**
   * GET /products with optional filters (category, mode: restaurantes | supermercado, query)
   */
  getProducts(filters?: { mode?: 'restaurantes' | 'supermercado'; category?: string; query?: string }): Observable<ProductDto[]> {
    let params = new HttpParams();
    if (filters?.mode) params = params.set('mode', filters.mode);
    if (filters?.category && filters.category !== 'Todas') params = params.set('category', filters.category);
    if (filters?.query) params = params.set('search', filters.query);

    const url = \`\${environment.awsApiUrl}\${environment.endpoints.products.list}\`;
    return this.http.get<ProductDto[]>(url, { params });
  }

  getProductById(id: string): Observable<ProductDto> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.products.detail(id)}\`;
    return this.http.get<ProductDto>(url);
  }
}
`;
