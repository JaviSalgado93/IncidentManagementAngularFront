import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { IncidentUpdate } from '../../../../core/models';

@Component({
  selector: 'app-update-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './update-item.component.html',
  styleUrl: './update-item.component.scss'
})
export class UpdateItemComponent {
  @Input() update!: IncidentUpdate;

  getUpdateIcon(): string {
    switch (this.update.updateType) {
      case 'COMMENT':
        return 'comment';
      case 'STATUS_CHANGE':
        return 'swap_horiz';
      case 'PRIORITY_CHANGE':
        return 'flag';
      case 'USER_REASSIGNMENT':
        return 'person';
      case 'CATEGORY_CHANGE':
        return 'category';
      default:
        return 'info';
    }
  }

  getUpdateIconColor(): string {
    switch (this.update.updateType) {
      case 'COMMENT':
        return '#2196f3';
      case 'STATUS_CHANGE':
        return '#4caf50';
      case 'PRIORITY_CHANGE':
        return '#ff9800';
      case 'USER_REASSIGNMENT':
        return '#9c27b0';
      case 'CATEGORY_CHANGE':
        return '#00bcd4';
      default:
        return '#757575';
    }
  }

  getUpdateTitle(): string {
    switch (this.update.updateType) {
      case 'COMMENT':
        return 'Comentario';
      case 'STATUS_CHANGE':
        return 'Cambió el estado';
      case 'PRIORITY_CHANGE':
        return 'Cambió la prioridad';
      case 'USER_REASSIGNMENT':
        return 'Reasignó el incidente';
      case 'CATEGORY_CHANGE':
        return 'Cambió la categoría';
      default:
        return 'Actualización';
    }
  }

  formatDate(dateString: string): string {
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

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  isComment(): boolean {
    return this.update.updateType === 'COMMENT';
  }

  hasChange(): boolean {
    return this.update.oldValue !== null && this.update.newValue !== null;
  }
}
