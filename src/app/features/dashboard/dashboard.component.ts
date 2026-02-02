import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Dashboard</h1>
      <p>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
      <p><strong>Usuario:</strong> {{ currentUser?.username }}</p>
      <p><strong>Email:</strong> {{ currentUser?.email }}</p>
      <p><strong>Rol:</strong> {{ currentUser?.role }}</p>

      <!-- Botón de logout temporal -->
      <button
        mat-raised-button
        color="warn"
        (click)="logout()"
        style="margin-top: 2rem;">
        <mat-icon>logout</mat-icon>
        Cerrar Sesión
      </button>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }
}
