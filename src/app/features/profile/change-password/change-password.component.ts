import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { AuthService } from '../../../core/services/auth.service';
import { ChangePasswordRequest } from '../../../core/models/auth.model';
import { ErrorMessageComponent } from '../../../shared/components';

@Component({
  selector: 'app-change-password',
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
    MatListModule,
    ErrorMessageComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  passwordForm!: FormGroup;
  loading = false;
  error: string | null = null;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  passwordRequirements = [
    { label: 'Al menos 8 caracteres', validator: (pwd: string) => pwd.length >= 8 },
    { label: 'Al menos una mayúscula', validator: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Al menos una minúscula', validator: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Al menos un número', validator: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Al menos un caracter especial', validator: (pwd: string) => /[!@#$%^&*(),.?":{}|<>\/]/.test(pwd) }
  ];

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmNewPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password) {
      return null;
    }

    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\/]/.test(password);

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return isValid ? null : { passwordStrength: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isRequirementMet(requirement: { validator: (pwd: string) => boolean }): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return requirement.validator(password);
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const request: ChangePasswordRequest = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmNewPassword: this.passwordForm.value.confirmNewPassword
    };

    this.authService.changePassword(request).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('✅ Contraseña cambiada exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });

          this.router.navigate(['/profile']);
        } else {
          this.error = response.message || 'Error al cambiar la contraseña';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error changing password:', err);
        this.error = err.error?.message || 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    if (control.errors['passwordStrength']) {
      return 'La contraseña no cumple con los requisitos';
    }

    return 'Campo inválido';
  }

  getConfirmPasswordError(): string {
    const control = this.passwordForm.get('confirmNewPassword');

    if (!control || !control.touched) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Este campo es requerido';
    }

    if (this.passwordForm.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  hasError(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  hasPasswordMismatch(): boolean {
    return !!(this.passwordForm.errors?.['passwordMismatch'] &&
             this.passwordForm.get('confirmNewPassword')?.touched);
  }
}
