import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { UpdateUserProfileRequest } from '../../../core/models/auth.model';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from '../../../shared/components';

@Component({
  selector: 'app-edit-profile',
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
    MatSnackBarModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  profileForm!: FormGroup;
  loading = false;
  loadingProfile = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  loadUserProfile(): void {
    this.loadingProfile = true;
    this.error = null;

    this.authService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profileForm.patchValue({
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName
          });
        } else {
          this.error = response.message || 'No se pudo cargar el perfil';
        }
        this.loadingProfile = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'No se pudo cargar el perfil. Intenta de nuevo.';
        this.loadingProfile = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const request: UpdateUserProfileRequest = {
      email: this.profileForm.value.email,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName
    };

    this.authService.updateProfile(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('✅ Perfil actualizado exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['/profile']);
        } else {
          this.error = response.message || 'Error al actualizar el perfil';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.error = err.error?.message || 'No se pudo actualizar el perfil. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['email']) {
      return 'Email inválido';
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
    const control = this.profileForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
}
