import { Routes } from '@angular/router';

export const INCIDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./incident-list/incident-list.component').then(m => m.IncidentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./incident-form/incident-form.component').then(m => m.IncidentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./incident-detail/incident-detail.component').then(m => m.IncidentDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./incident-form/incident-form.component').then(m => m.IncidentFormComponent)
  }
];
