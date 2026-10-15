import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { environment } from '../../../environments/environment';
import { cognitoInterceptor } from './cognito.interceptor';
import { CognitoService } from './cognito.service';

const API = environment.api.baseUrl;

// Ocupa el lugar del MsalInterceptor y guarda las URLs que recibe
@Injectable()
class InterceptorDeClase implements HttpInterceptor {
  static urls: string[] = [];
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    InterceptorDeClase.urls.push(req.url);
    return next.handle(req);
  }
}

function configurar(idToken: string | null) {
  InterceptorDeClase.urls = [];
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideHttpClient(withInterceptors([cognitoInterceptor]), withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: HTTP_INTERCEPTORS, useClass: InterceptorDeClase, multi: true },
      { provide: CognitoService, useValue: { idToken: signal(idToken) } },
    ],
  });
  return { http: TestBed.inject(HttpClient), backend: TestBed.inject(HttpTestingController) };
}

describe('cognitoInterceptor', () => {
  it('con sesión de Cognito usa la ruta /cognito y el ID token', () => {
    const { http, backend } = configurar('id-token-cognito');

    http.get(`${API}/api/v1/ordenes`).subscribe();

    const req = backend.expectOne(`${API}/cognito/api/v1/ordenes`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer id-token-cognito');
    // El interceptor de MSAL ya no ve una URL de su protectedResourceMap
    expect(InterceptorDeClase.urls).toEqual([`${API}/cognito/api/v1/ordenes`]);
    req.flush([]);
  });

  it('sin sesión de Cognito no toca la petición', () => {
    const { http, backend } = configurar(null);

    http.get(`${API}/api/v1/ordenes`).subscribe();

    const req = backend.expectOne(`${API}/api/v1/ordenes`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('no modifica llamadas fuera del API Gateway', () => {
    const { http, backend } = configurar('id-token-cognito');

    http.get('https://otro-sitio.cl/datos').subscribe();

    const req = backend.expectOne('https://otro-sitio.cl/datos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
