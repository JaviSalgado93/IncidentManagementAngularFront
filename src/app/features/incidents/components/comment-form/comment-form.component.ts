import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { IncidentService } from '../../../../core/services/incident.service';
import { AddCommentRequest } from '../../../../core/models';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent {
  @Input() incidentId!: string;
  @Output() commentAdded = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private incidentService = inject(IncidentService);
  private snackBar = inject(MatSnackBar);

  commentForm: FormGroup;
  loading = false;

  constructor() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    if (!this.incidentId) {
      this.snackBar.open('ID de incidente no proporcionado', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.loading = true;

    const request: AddCommentRequest = {
      comment: this.commentForm.value.comment.trim()
    };

    this.incidentService.addComment(this.incidentId, request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Comentario agregado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });

          this.commentForm.reset();
          this.commentAdded.emit();
        } else {
          this.snackBar.open(`${response.message || 'Error al agregar comentario'}`, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.snackBar.open('No se pudo agregar el comentario. Intenta de nuevo.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  getCharacterCount(): number {
    return this.commentForm.get('comment')?.value?.length || 0;
  }

  hasError(): boolean {
    const control = this.commentForm.get('comment');
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(): string {
    const control = this.commentForm.get('comment');

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'El comentario es requerido';
    }
    if (control.errors['minlength']) {
      return 'El comentario debe tener al menos 10 caracteres';
    }
    if (control.errors['maxlength']) {
      return 'El comentario no puede exceder 1000 caracteres';
    }

    return 'Comentario inválido';
  }
}
