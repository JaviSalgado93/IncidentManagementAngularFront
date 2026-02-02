import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // URLs que NO necesitan token (públicas)
  const publicUrls = ['/auth/login', '/auth/register'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Si es URL pública, dejar pasar sin modificar
  if (isPublicUrl) {
    return next(req);
  }

  // Obtener access token
  const token = tokenService.getAccessToken();

  // Si no hay token, continuar sin agregar header
  // (el backend retornará 401 si la ruta requiere auth)
  if (!token) {
    return next(req);
  }

  // Clonar request y agregar header Authorization
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Enviar request modificado
  return next(clonedReq).pipe(
    catchError(error => {
      // Si el backend retorna 401 (Unauthorized)
      if (error.status === 401) {
        // Verificar si NO es un intento de login/register (ya fallaron, no reintentar)
        if (isPublicUrl) {
          return throwError(() => error);
        }

        // Intentar refrescar el token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Refresh exitoso, reintentar request original con nuevo token
            const newToken = tokenService.getAccessToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            // Refresh falló, hacer logout
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // Otros errores (500, 403, etc.), propagarlos
      return throwError(() => error);
    })
  );
};
