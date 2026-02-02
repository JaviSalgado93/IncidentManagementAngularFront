import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>Profile Page</h1>
      <p>Coming soon... (Fase 10)</p>
    </div>
  `
})
export class ProfileComponent {}
