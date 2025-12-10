import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = false;
    errorMessage = '';

    form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            this.errorMessage = '';
            const { username, password } = this.form.value;

            this.authService.login(username!, password!).subscribe({
                next: (response) => {
                    this.loading = false;
                    // Redirigir según rol
                    const user = response.usuario || response.user;
                    if (user?.role === 'admin') {
                        this.router.navigate(['/admin']);
                    } else if (user?.role === 'analista') {
                        this.router.navigate(['/analista']);
                    } else {
                        this.router.navigate(['/solicitar']);
                    }
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.error?.error || error.error?.message || 'Credenciales inválidas';
                    console.error('Error:', error);
                }
            });
        }
    }
}

