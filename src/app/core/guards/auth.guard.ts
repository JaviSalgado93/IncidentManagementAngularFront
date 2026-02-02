import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  const isAuthenticated = tokenService.isAuthenticated();
  if (isAuthenticated) {
    // Usuario logueado, permitir acceso
    return true;
  }

  // Usuario NO logueado, redirigir a login
  // Guardar la URL que intentaba acceder (para redirigir después del login)
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
