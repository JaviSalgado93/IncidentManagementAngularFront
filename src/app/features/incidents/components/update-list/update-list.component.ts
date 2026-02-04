import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { IncidentService } from '../../../../core/services/incident.service';
import { IncidentUpdate } from '../../../../core/models';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from '../../../../shared/components';
import { UpdateItemComponent } from '../update-item/update-item.component';

@Component({
  selector: 'app-update-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    UpdateItemComponent
  ],
  templateUrl: './update-list.component.html',
  styleUrl: './update-list.component.scss'
})
export class UpdateListComponent implements OnInit {
  @Input() incidentId!: string;

  private incidentService = inject(IncidentService);

  updates: IncidentUpdate[] = [];
  loading = false;
  error: string | null = null;
  selectedFilter: 'all' | 'comments' | 'changes' = 'all';

  ngOnInit(): void {
    this.loadUpdates();
  }

  loadUpdates(): void {
    if (!this.incidentId) {
      this.error = 'ID de incidente no proporcionado';
      return;
    }

    this.loading = true;
    this.error = null;

    this.incidentService.getIncidentUpdates(this.incidentId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updates = response.data;
          // Ordenar por fecha descendente (más reciente primero)
          this.updates.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else {
          this.error = response.message || 'No se pudieron cargar las actualizaciones';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading updates:', err);
        this.error = 'No se pudieron cargar las actualizaciones. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  get filteredUpdates(): IncidentUpdate[] {
    switch (this.selectedFilter) {
      case 'comments':
        return this.updates.filter(u => u.updateType === 'COMMENT');
      case 'changes':
        return this.updates.filter(u => u.updateType !== 'COMMENT');
      case 'all':
      default:
        return this.updates;
    }
  }

  get totalUpdates(): number {
    return this.updates.length;
  }

  get totalComments(): number {
    return this.updates.filter(u => u.updateType === 'COMMENT').length;
  }

  get totalChanges(): number {
    return this.updates.filter(u => u.updateType !== 'COMMENT').length;
  }

  setFilter(filter: 'all' | 'comments' | 'changes'): void {
    this.selectedFilter = filter;
  }

  onUpdateAdded(): void {
    // Este método será llamado cuando se agregue un comentario
    this.loadUpdates();
  }

  trackByUpdateId(index: number, update: IncidentUpdate): string {
    return update.id;
  }
}
