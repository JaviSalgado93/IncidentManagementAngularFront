import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_INFO_KEY = 'user_info';

  constructor() {}

  // ========== ACCESS TOKEN ==========
  saveAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // ========== REFRESH TOKEN ==========
  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // ========== USER INFO ==========
  saveUserInfo(user: any): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(user));
  }

  getUserInfo(): any | null {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    if (!userInfo) return null;

    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error('Error parsing user info from localStorage', error);
      return null;
    }
  }

  removeUserInfo(): void {
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  // ========== UTILIDADES ==========
  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserInfo();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Verificar si el token no ha expirado (básico)
    try {
      const payload = this.decodeToken(token);
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() < exp;
    } catch (error) {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
