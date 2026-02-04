import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import {
  LoadingSpinnerComponent,
  ErrorMessageComponent
} from '../../shared/components';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = null;

    this.authService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.user = response.data;
        } else {
          this.error = response.message || 'No se pudo cargar el perfil';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'No se pudo cargar el perfil. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  changePassword(): void {
    this.router.navigate(['/profile/change-password']);
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return 'justo ahora';
      if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
      if (diffInHours < 24) return `hace ${diffInHours}h`;
      if (diffInDays === 1) return 'ayer';
      if (diffInDays < 7) return `hace ${diffInDays} días`;

      return date.toLocaleDateString('es-ES');
    } catch {
      return 'No disponible';
    }
  }

  getRoleBadgeColor(): string {
    switch (this.user?.role.toLowerCase()) {
      case 'admin':
        return '#f44336';
      case 'moderator':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  }

  getRoleIcon(): string {
    switch (this.user?.role.toLowerCase()) {
      case 'admin':
        return 'admin_panel_settings';
      case 'moderator':
        return 'verified_user';
      default:
        return 'person';
    }
  }
}
