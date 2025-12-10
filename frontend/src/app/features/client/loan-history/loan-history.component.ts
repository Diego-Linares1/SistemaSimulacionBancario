import { Component, inject, signal, OnInit } from '@angular/core';
import { LoanService } from '../../../core/services/loan.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  private loanService = inject(LoanService);
  private router = inject(Router);

  loans = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadMyLoans();
  }

  loadMyLoans() {
    this.loading.set(true);
    this.error.set(null);

    this.loanService.getMyLoans().subscribe({
      next: (data) => {
        this.loans.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar tus solicitudes');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  navigateToNewRequest() {
    this.router.navigate(['/solicitar']);
  }
}
