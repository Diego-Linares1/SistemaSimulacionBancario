import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterModule,
        CommonModule
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    user$ = this.authService.user$;

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    isAdmin() {
        return this.authService.isAdmin();
    }
}

