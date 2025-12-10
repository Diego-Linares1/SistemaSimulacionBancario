import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}
}

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si hay token en localStorage
    const token = authService.getTokenFromStorage();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Verificar si el usuario es admin o analista
    if (authService.isAdminOrAnalyst()) {
        return true;
    } else {
        // No tiene permisos, redirigir a login
        router.navigate(['/login']);
        return false;
    }
};

// Guard para rutas exclusivas de admin (no analista)
export const adminOnlyGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si hay token en localStorage
    const token = authService.getTokenFromStorage();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Solo admin puede acceder
    if (authService.isAdmin()) {
        return true;
    } else {
        // No tiene permisos, redirigir a admin panel
        router.navigate(['/admin']);
        return false;
    }
};

// Guard para rutas de clientes
export const clientGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si hay token en localStorage
    const token = authService.getTokenFromStorage();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Verificar si el usuario es cliente
    const user = authService.getCurrentUser();
    if (user?.role === 'cliente') {
        return true;
    } else {
        // No es cliente, redirigir según rol
        if (authService.isAdminOrAnalyst()) {
            router.navigate(['/analista']);
        } else {
            router.navigate(['/login']);
        }
        return false;
    }
};

// Guard para rutas de analista
export const analistaGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si hay token en localStorage
    const token = authService.getTokenFromStorage();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Verificar si es analista o admin
    if (authService.isAdminOrAnalyst()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificar si hay token en localStorage
    const token = authService.getTokenFromStorage();
    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    // Token existe, permitir acceso
    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

