import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { IncidentService } from '../../core/services/incident.service';
import { AuthService } from '../../core/services/auth.service';
import { Incident } from '../../core/models';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from '../../shared/components';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { RecentIncidentsComponent } from './components/recent-incidents/recent-incidents.component';

interface PriorityStats {
  name: string;
  count: number;
  color: string;
}

interface CategoryStats {
  name: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    StatsCardComponent,
    RecentIncidentsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private incidentService = inject(IncidentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  incidents: Incident[] = [];
  loading = false;
  error: string | null = null;

  // User info
  userName: string = '';

  // Stats principales
  totalIncidents = 0;
  openIncidents = 0;
  inProgressIncidents = 0;
  closedIncidents = 0;

  // Recientes (últimos 5)
  recentIncidents: Incident[] = [];

  // Por prioridad (top 5)
  priorityStats: PriorityStats[] = [];

  // Por categoría (top 5)
  categoryStats: CategoryStats[] = [];

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadMyIncidents();
  }

  loadUserInfo(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName || user.email.split('@')[0];
      }
    });
  }

  loadMyIncidents(): void {
    this.loading = true;
    this.error = null;

    this.incidentService.getMyIncidents().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.incidents = response.data;
          this.calculateStats();
        } else {
          this.error = response.message || 'No se pudieron cargar los incidentes';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading my incidents:', err);
        this.error = 'No se pudieron cargar los incidentes. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    // Stats principales
    this.totalIncidents = this.incidents.length;
    this.openIncidents = this.incidents.filter(i => i.statusId === 1).length;
    this.inProgressIncidents = this.incidents.filter(i => i.statusId === 2).length;
    this.closedIncidents = this.incidents.filter(i => i.statusId === 3 || i.statusId === 4).length;

    // Recientes (últimos 5, ordenados por fecha descendente)
    this.recentIncidents = [...this.incidents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Por prioridad
    const priorityMap = new Map<number, { name: string; count: number; color: string }>();

    this.incidents.forEach(incident => {
      const existing = priorityMap.get(incident.priority);
      if (existing) {
        existing.count++;
      } else {
        priorityMap.set(incident.priority, {
          name: incident.priorityName,
          count: 1,
          color: incident.priorityColor
        });
      }
    });

    this.priorityStats = Array.from(priorityMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Por categoría
    const categoryMap = new Map<string, number>();

    this.incidents.forEach(incident => {
      const count = categoryMap.get(incident.categoryName) || 0;
      categoryMap.set(incident.categoryName, count + 1);
    });

    this.categoryStats = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  createIncident(): void {
    this.router.navigate(['/incidents/new']);
  }

  viewAllIncidents(): void {
    this.router.navigate(['/incidents']);
  }
}
