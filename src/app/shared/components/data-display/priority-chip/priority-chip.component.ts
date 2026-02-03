import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-priority-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-chip [style.background-color]="priorityColor || '#808080'" [style.color]="getTextColor()">
      <mat-icon>{{ getIcon() }}</mat-icon>
      {{ priorityName || priority }}
    </mat-chip>
  `,
  styles: [`
    mat-chip {
      font-weight: 500;
      font-size: 0.75rem;
      min-height: 24px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
  `]
})
export class PriorityChipComponent {
  @Input() priority!: number;
  @Input() priorityName?: string;
  @Input() priorityColor?: string;

  getTextColor(): string {
    const bgColor = this.priorityColor || '#808080';
    const isDark = this.isColorDark(bgColor);
    return isDark ? '#ffffff' : '#000000';
  }

  private isColorDark(hexColor: string): boolean {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }

  getIcon(): string {
    if (this.priority <= 2) return 'arrow_downward';
    if (this.priority === 3) return 'remove';
    if (this.priority === 4) return 'arrow_upward';
    return 'priority_high';
  }
}
