import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ========== RUTAS PÚBLICAS (sin autenticación) ==========
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // ========== RUTAS PRIVADAS (requieren autenticación) ==========
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'incidents',
    loadChildren: () => import('./features/incidents/incidents.routes').then(m => m.INCIDENT_ROUTES),
    canActivate: [authGuard]
  },

  // ========== REDIRECT RAÍZ ==========
  {
    path: '',
    redirectTo: 'login',  // ← Redirigir a login en vez de dashboard
    pathMatch: 'full'
  },

  // ========== RUTA 404 ==========
  {
    path: '**',
    redirectTo: 'login'  // ← Redirigir a login en vez de dashboard
  }
];
