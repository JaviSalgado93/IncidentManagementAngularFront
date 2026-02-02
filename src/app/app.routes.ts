import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect raíz a login (por ahora)
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // Rutas públicas (sin autenticación)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Rutas privadas (requieren autenticación - lo implementaremos en Fase 2)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    // canActivate: [authGuard]  // Lo agregaremos en Fase 2
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    // canActivate: [authGuard]
  },
  {
    path: 'incidents',
    loadChildren: () => import('./features/incidents/incidents.routes').then(m => m.INCIDENT_ROUTES)
    // canActivate: [authGuard]
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: '/login'
  }
];
