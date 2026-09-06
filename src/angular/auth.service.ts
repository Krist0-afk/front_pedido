/**
 * Angular Authentication Service for AWS API Gateway / Cognito JWT.
 */

export const authServiceCode = `
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, catchError, of } from 'rxjs';
import { environment } from './environment';
import { AuthResponse, UserProfile } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'pedidos360_jwt_token';
  private readonly USER_KEY = 'pedidos360_user_profile';

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Login against AWS API Gateway endpoint
   * POST \${environment.awsApiUrl}/auth/login
   */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.auth.login}\`;
    
    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap(res => {
        this.saveSession(res.token, res.user);
      })
    );
  }

  /**
   * Register new user against AWS API Gateway
   */
  register(userData: { name: string; email: string; password: string; rut?: string; phone?: string }): Observable<AuthResponse> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.auth.register}\`;

    return this.http.post<AuthResponse>(url, userData).pipe(
      tap(res => {
        this.saveSession(res.token, res.user);
      })
    );
  }

  /**
   * Fetch authenticated user profile from AWS
   */
  getProfile(): Observable<UserProfile> {
    const url = \`\${environment.awsApiUrl}\${environment.endpoints.auth.profile}\`;
    return this.http.get<UserProfile>(url).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }

  saveSession(token: string, user: UserProfile): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private getStoredUser(): UserProfile | null {
    const raw = localStorage.getItem(this.USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
`;
