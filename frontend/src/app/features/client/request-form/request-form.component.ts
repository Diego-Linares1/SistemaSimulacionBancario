import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoanService } from '../../../core/services/loan.service';

@Component({
    selector: 'app-request-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent {
    private fb = inject(FormBuilder);
    private loanService = inject(LoanService);
    private router = inject(Router);

    loading = false;
    errorMessage = '';
    successMessage = '';

    form = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        dni: ['', Validators.required],
        ingreso: [0, [Validators.required, Validators.min(1)]],
        monto: [0, [Validators.required, Validators.min(1)]],
        plazo: [12, [Validators.required, Validators.min(1)]]
    });

    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const formValue = this.form.value as any;
            this.loanService.addRequest(formValue).subscribe({
                next: (response) => {
                    this.loading = false;
                    this.successMessage = '¡Solicitud enviada exitosamente!';
                    this.form.reset();
                    setTimeout(() => this.successMessage = '', 5000);
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.error?.message || 'Error al enviar la solicitud';
                    console.error('Error:', error);
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/']);
    }
}
