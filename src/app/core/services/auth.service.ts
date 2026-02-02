import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateUserProfileRequest
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { UserInfo } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado de autenticación
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(
    this.tokenService.getUserInfo()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.tokenService.isAuthenticated()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Verificar autenticación al iniciar
    this.checkAuthStatus();
  }

  // ========== LOGIN ==========
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.handleAuthSuccess(response.data);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // ========== REGISTER ==========
  register(userData: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.handleAuthSuccess(response.data);
          }
        }),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  // ========== REFRESH TOKEN ==========
  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.handleAuthSuccess(response.data);
          }
        }),
        catchError(error => {
          console.error('Refresh token error:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  // ========== LOGOUT ==========
  logout(): void {
    // Llamar al endpoint de logout (opcional)
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/revoke-refresh-token`, { refreshToken })
        .subscribe({
          error: (error) => console.error('Logout error:', error)
        });
    }

    // Limpiar estado local
    this.tokenService.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // ========== CHANGE PASSWORD ==========
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, request)
      .pipe(
        catchError(error => {
          console.error('Change password error:', error);
          return throwError(() => error);
        })
      );
  }

  // ========== UPDATE PROFILE ==========
  updateProfile(request: UpdateUserProfileRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/update-profile`, request)
      .pipe(
        tap(() => {
          // Actualizar user info en localStorage
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...request };
            this.tokenService.saveUserInfo(updatedUser);
            this.currentUserSubject.next(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          return throwError(() => error);
        })
      );
  }

  // ========== UTILIDADES ==========
  private handleAuthSuccess(data: LoginResponse): void {
    // Guardar tokens
    this.tokenService.saveAccessToken(data.accessToken);
    this.tokenService.saveRefreshToken(data.refreshToken);
    this.tokenService.saveUserInfo(data.user);

    // Actualizar estado
    this.currentUserSubject.next(data.user);
    this.isAuthenticatedSubject.next(true);
  }

  private checkAuthStatus(): void {
    const isAuth = this.tokenService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuth);

    if (!isAuth) {
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
