import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { IncidentService } from '../../../core/services/incident.service';
import {
  Incident,
  IncidentFilterParams,
  Category,
  IncidentStatusInfo,
  PriorityInfo
} from '../../../core/models';
import {
  LoadingSpinnerComponent,
  EmptyStateComponent,
  ErrorMessageComponent,
  ConfirmDialogComponent,
  StatusBadgeComponent,
  PriorityChipComponent
} from '../../../shared/components';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    StatusBadgeComponent,
    PriorityChipComponent
  ],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent implements OnInit {
  private incidentService = inject(IncidentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  incidents: Incident[] = [];
  displayedColumns: string[] = ['title', 'status', 'priority', 'category', 'userName', 'createdAt', 'actions'];

  loading = false;
  error: string | null = null;

  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 25, 50];

  filters: IncidentFilterParams = {
    PageNumber: 1,
    PageSize: 10,
    SortBy: 'createdAt',
    SortOrder: 'desc'
  };
  searchTerm = '';
  selectedStatusId: number | null = null;
  selectedPriority: number | null = null;
  selectedCategoryId = '';

  categories: Category[] = [];
  statuses: IncidentStatusInfo[] = [];
  priorities: PriorityInfo[] = [];
  snackBar: any;

  ngOnInit(): void {
    this.loadCatalogs();
    this.loadIncidents();
  }

  loadCatalogs(): void {
    this.incidentService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (err) => console.error('Error loading categories:', err)
    });

    this.incidentService.getStatuses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statuses = response.data;
        }
      },
      error: (err) => console.error('Error loading statuses:', err)
    });

    this.incidentService.getPriorities().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.priorities = response.data;
        }
      },
      error: (err) => console.error('Error loading priorities:', err)
    });
  }

  loadIncidents(): void {
    this.loading = true;
    this.error = null;

    this.incidentService.getIncidents(this.filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.incidents = response.data;
          this.totalCount = response.meta.totalRecords;
          this.pageNumber = response.meta.pageNumber;
          this.pageSize = response.meta.pageSize;
        } else {
          this.error = response.message || 'Error al cargar incidentes';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
        this.error = 'No se pudieron cargar los incidentes. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.filters.PageNumber = event.pageIndex + 1;
    this.filters.PageSize = event.pageSize;
    this.loadIncidents();
  }

  onSearch(): void {
    this.filters.Title = this.searchTerm.trim() || undefined;
    this.filters.PageNumber = 1;
    this.loadIncidents();
  }

  onFilterChange(): void {
    this.filters.StatusId = this.selectedStatusId || undefined;
    this.filters.Priority = this.selectedPriority || undefined;
    this.filters.CategoryId = this.selectedCategoryId || undefined;
    this.filters.PageNumber = 1;
    this.loadIncidents();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatusId = null;
    this.selectedPriority = null;
    this.selectedCategoryId = '';
    this.filters = {
      PageNumber: 1,
      PageSize: this.pageSize,
      SortBy: 'createdAt',
      SortOrder: 'desc'
    };
    this.loadIncidents();
  }

  viewIncident(id: string): void {
    this.router.navigate(['/incidents', id]);
  }

  editIncident(id: string): void {
    this.router.navigate(['/incidents', id, 'edit']);
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

  createIncident(): void {
    this.router.navigate(['/incidents/new']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return '#808080';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.color || '#808080';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }
}
