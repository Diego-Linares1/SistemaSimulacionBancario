import { Component, inject, signal, OnInit } from '@angular/core';
import { LoanService } from '../../../core/services/loan.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-table',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit {

  private loanService = inject(LoanService);
  authService = inject(AuthService);
  private router = inject(Router);

  // Señales para datos y estado
  loans = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadLoans();
  }

  navigateToCreateUser() {
    this.router.navigate(['/admin/create-user']);
  }

  loadLoans() {
    this.loading.set(true);
    this.error.set(null);

    this.loanService.getAllLoans().subscribe({
      next: (data) => this.loans.set(data),
      error: (err) => {
        console.error('Error:', err);
        this.error.set('Error cargando las solicitudes. Verifica que estés autenticado como admin.');
      },
      complete: () => this.loading.set(false)
    });
  }

  approve(id: string) {
    this.loanService.updateLoanStatus(id, 'APROBADA').subscribe({
      next: () => this.loadLoans(),
      error: (err) => {
        console.error('Error al aprobar:', err);
        this.error.set('Error al aprobar la solicitud');
      }
    });
  }

  reject(id: string) {
    this.loanService.updateLoanStatus(id, 'RECHAZADA').subscribe({
      next: () => this.loadLoans(),
      error: (err) => {
        console.error('Error al rechazar:', err);
        this.error.set('Error al rechazar la solicitud');
      }
    });
  }
}

