import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface User {
    id?: string;
    email?: string;
    username?: string;
    nombre?: string;
    role: 'admin' | 'analista' | 'cliente';
}

export interface AuthResponse {
    token: string;
    usuario?: User;
    user?: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/auth';
    
    private userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    private tokenSubject = new BehaviorSubject<string | null>(this.getTokenFromStorage());
    
    user$ = this.userSubject.asObservable();
    token$ = this.tokenSubject.asObservable();

    login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    const user = response.usuario || response.user;
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        this.userSubject.next(user);
                        this.tokenSubject.next(response.token);
                    }
                })
            );
    }

    register(nombre: string, username: string, password: string, role: 'cliente' | 'analista' | 'admin'): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { nombre, username, password, role })
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    const user = response.usuario || response.user;
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                        this.userSubject.next(user);
                        this.tokenSubject.next(response.token);
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.tokenSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.getTokenFromStorage();
    }

    isAdmin(): boolean {
        const user = this.getUserFromStorage();
        return user?.role === 'admin';
    }

    isAnalyst(): boolean {
        const user = this.getUserFromStorage();
        return user?.role === 'analista';
    }

    isAdminOrAnalyst(): boolean {
        const user = this.getUserFromStorage();
        return user?.role === 'admin' || user?.role === 'analista';
    }

    getCurrentUser(): User | null {
        return this.userSubject.value;
    }

    getTokenFromStorage(): string | null {
        return localStorage.getItem('token');
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

