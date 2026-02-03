import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Dashboard</h1>

      <mat-card class="user-card">
        <mat-card-content>
          <div class="user-info">
            <mat-icon class="user-avatar">account_circle</mat-icon>
            <div class="user-details">
              <h2>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
              <p><strong>Usuario:</strong> {{ currentUser?.username }}</p>
              <p><strong>Email:</strong> {{ currentUser?.email }}</p>
              <p><strong>Rol:</strong> {{ currentUser?.role }}</p>
            </div>
          </div>

          <button
            mat-raised-button
            color="warn"
            (click)="logout()"
            class="logout-button">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    // .dashboard-container {
    //   max-width: 1200px;
    //   margin: 0 auto;
    // }

    .dashboard-title {
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 2rem;
      color: rgba(0, 0, 0, 0.87);
    }

    .user-card {
      max-width: 600px;
    }

    .user-info {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      margin-bottom: 2rem;

      .user-avatar {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #1976d2;
      }

      .user-details {
        flex: 1;

        h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.87);
        }

        p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: rgba(0, 0, 0, 0.7);

          strong {
            color: rgba(0, 0, 0, 0.87);
          }
        }
      }
    }

    .logout-button {
      width: 100%;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
  }
}
