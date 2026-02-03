import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip [ngClass]="getStatusClass()">
      {{ statusName || status }}
    </mat-chip>
  `,
  styles: [`
    mat-chip {
      font-weight: 500;
      font-size: 0.75rem;
      min-height: 24px;
      padding: 0 8px;

      &.status-1 {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      &.status-2 {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.status-3 {
        background-color: #e8f5e9;
        color: #388e3c;
      }

      &.status-4 {
        background-color: #f5f5f5;
        color: #616161;
      }
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: string;
  @Input() statusName?: string;

  getStatusClass(): string {
    return 'status-' + this.status;
  }
}
