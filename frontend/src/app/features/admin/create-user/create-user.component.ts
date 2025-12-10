import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-create-user',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loading = false;
    errorMessage = '';
    successMessage = '';

    form = this.fb.group({
        nombre: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['cliente', Validators.required]
    });

    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';
            
            const { nombre, username, password, role } = this.form.value;

            this.authService.register(
                nombre!,
                username!,
                password!,
                role as 'cliente' | 'analista' | 'admin'
            ).subscribe({
                next: () => {
                    this.loading = false;
                    this.successMessage = `Usuario ${username} creado exitosamente con rol: ${role}`;
                    this.form.reset({ role: 'cliente' });
                },
                error: (error) => {
                    this.loading = false;
                    this.errorMessage = error.error?.error || error.error?.message || 'Error al crear usuario';
                    console.error('Error:', error);
                }
            });
        }
    }
}
