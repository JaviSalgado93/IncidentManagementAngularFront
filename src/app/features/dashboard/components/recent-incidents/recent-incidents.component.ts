import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { Incident } from '../../../../core/models';
import {
  StatusBadgeComponent,
  PriorityChipComponent
} from '../../../../shared/components';

@Component({
  selector: 'app-recent-incidents',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    StatusBadgeComponent,
    PriorityChipComponent
  ],
  templateUrl: './recent-incidents.component.html',
  styleUrl: './recent-incidents.component.scss'
})
export class RecentIncidentsComponent {
  @Input() incidents: Incident[] = [];

  constructor(private router: Router) {}

  viewIncident(id: string): void {
    this.router.navigate(['/incidents', id]);
  }

  viewAllIncidents(): void {
    this.router.navigate(['/incidents']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }
}
