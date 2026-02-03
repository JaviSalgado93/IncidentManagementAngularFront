import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { IncidentService } from '../../../core/services/incident.service';
import { Incident } from '../../../core/models';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent,
  ConfirmDialogComponent,
  StatusBadgeComponent,
  PriorityChipComponent
} from '../../../shared/components';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    StatusBadgeComponent,
    PriorityChipComponent
  ],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss'
})
export class IncidentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidentService = inject(IncidentService);
  private dialog = inject(MatDialog);

  incident: Incident | null = null;
  loading = false;
  error: string | null = null;
  snackBar: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncident(id);
    } else {
      this.error = 'ID de incidente no válido';
    }
  }

  loadIncident(id: string): void {
    this.loading = true;
    this.error = null;

    this.incidentService.getIncidentById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.incident = response.data;
        } else {
          this.error = response.message || 'No se pudo cargar el incidente';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incident:', err);
        this.error = 'No se pudo cargar el incidente. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

  editIncident(): void {
    if (this.incident) {
      this.router.navigate(['/incidents', this.incident.id, 'edit']);
    }
  }

  deleteIncident(incident: Incident): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'custom-dialog-container',
      data: {
        title: '¿Eliminar incidente?',
        message: '¿Estás seguro de que deseas eliminar este incidente? Esta acción no se puede deshacer.',
        details: incident.title,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.incidentService.deleteIncident(incident.id).subscribe({
          next: (response) => {
            if (response.success) {
              // En incident-list, recargar la lista
              // En incident-detail, navegar a /incidents
              this.router.navigate(['/incidents']);

              this.snackBar.open('✅ Incidente eliminado exitosamente', 'Cerrar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
            } else {
              this.error = response.message || 'Error al eliminar incidente';
              this.loading = false;
            }
          },
          error: (err) => {
            console.error('Error deleting incident:', err);
            this.error = 'No se pudo eliminar el incidente';
            this.loading = false;
          }
        });
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateShort(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
