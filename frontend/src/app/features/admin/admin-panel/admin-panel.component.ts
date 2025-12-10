import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  private router = inject(Router);

  navigateToCreateUser() {
    this.router.navigate(['/admin/create-user']);
  }

  navigateToLogs() {
    this.router.navigate(['/admin/logs']);
  }
}
