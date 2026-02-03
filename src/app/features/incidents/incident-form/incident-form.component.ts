import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IncidentService } from '../../../core/services/incident.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  Category,
  IncidentStatusInfo,
  PriorityInfo
} from '../../../core/models';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from '../../../shared/components';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './incident-form.component.html',
  styleUrl: './incident-form.component.scss'
})
export class IncidentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incidentService = inject(IncidentService);
  private snackBar = inject(MatSnackBar);

  incidentForm!: FormGroup;
  isEditMode = false;
  incidentId: string | null = null;
  loading = false;
  loadingCatalogs = false;
  error: string | null = null;

  categories: Category[] = [];
  statuses: IncidentStatusInfo[] = [];
  priorities: PriorityInfo[] = [];

  ngOnInit(): void {
    this.incidentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.incidentId && this.route.snapshot.url.some(segment => segment.path === 'edit');

    this.initForm();
    this.loadCatalogs();

    if (this.isEditMode && this.incidentId) {
      this.loadIncident(this.incidentId);
    }
  }

  initForm(): void {
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      priority: [null, Validators.required],
      categoryId: ['', Validators.required],
      statusId: [null]
    });

    if (!this.isEditMode) {
      this.incidentForm.get('statusId')?.disable();
    }
  }

  loadCatalogs(): void {
    this.loadingCatalogs = true;

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
          this.loadingCatalogs = false;
        }
      },
      error: (err) => {
        console.error('Error loading priorities:', err);
        this.loadingCatalogs = false;
      }
    });
  }

  loadIncident(id: string): void {
    this.loading = true;
    this.error = null;

    this.incidentService.getIncidentById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.patchFormValues(response.data);
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

  patchFormValues(incident: Incident): void {
    this.incidentForm.patchValue({
      title: incident.title,
      description: incident.description,
      priority: incident.priority,
      categoryId: incident.categoryId,
      statusId: incident.statusId
    });
  }

  onSubmit(): void {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode && this.incidentId) {
      this.updateIncident();
    } else {
      this.createIncident();
    }
  }

createIncident(): void {
  const formValue = this.incidentForm.value;
  const request: CreateIncidentRequest = {
    title: formValue.title,
    description: formValue.description,
    priority: formValue.priority,
    categoryId: formValue.categoryId
  };

  this.incidentService.createIncident(request).subscribe({
    next: (response) => {
      if (response.success) {

        // Mostrar mensaje de éxito
        this.snackBar.open('✅ Incidente creado exitosamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Si viene data con ID, navegar al detalle
        if (response.data?.id) {
          this.router.navigate(['/incidents', response.data.id]);
        } else {
          // Si no viene data, navegar a la lista
          this.router.navigate(['/incidents']);
        }
      } else {
        this.error = response.message || 'Error al crear el incidente';
        this.loading = false;
      }
    },
    error: (err) => {
      console.error('Error creating incident:', err);
      this.error = 'No se pudo crear el incidente. Intenta de nuevo.';
      this.loading = false;
    }
  });
}

updateIncident(): void {
  if (!this.incidentId) return;

  const formValue = this.incidentForm.value;
  const request: UpdateIncidentRequest = {
    title: formValue.title,
    description: formValue.description,
    priority: formValue.priority,
    categoryId: formValue.categoryId,
    statusId: formValue.statusId
  };

  this.incidentService.updateIncident(this.incidentId, request).subscribe({
    next: (response) => {
      if (response.success) {

        // Mostrar mensaje de éxito
        this.snackBar.open('✅ Incidente actualizado exitosamente', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Éxito: navegar al detalle del incidente
        this.router.navigate(['/incidents', this.incidentId]);
      } else {
        // El backend dice que falló
        this.error = response.message || 'Error al actualizar el incidente';
        this.loading = false;
      }
    },
    error: (err) => {
      console.error('Error updating incident:', err);
      this.error = 'No se pudo actualizar el incidente. Intenta de nuevo.';
      this.loading = false;
    }
  });
}

  cancel(): void {
    if (this.isEditMode && this.incidentId) {
      this.router.navigate(['/incidents', this.incidentId]);
    } else {
      this.router.navigate(['/incidents']);
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.incidentForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return 'Campo inválido';
  }

  hasError(fieldName: string): boolean {
    const control = this.incidentForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
