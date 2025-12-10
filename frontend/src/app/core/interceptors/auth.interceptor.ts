import { Injectable, inject } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);
    private router = inject(Router);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Agregar token al header si existe
        const token = this.authService.getTokenFromStorage();
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // Si es error 401, logout y redirigir a login
                if (error.status === 401) {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}

export const authInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
};
