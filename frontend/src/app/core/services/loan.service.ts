import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoanRequest {
    id?: string;
    nombre: string;
    apellido: string;
    dni: string;
    ingreso: number;
    monto: number;
    plazo: number;
    fecha?: string;
    estado?: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

@Injectable({
    providedIn: 'root',
})
export class LoanService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/loans';
    private authUrl = 'http://localhost:3000/auth';

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        });
    }

    // Crear nueva solicitud de préstamo
    addRequest(data: LoanRequest): Observable<any> {
        return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
    }

    // Obtener todas las solicitudes (requiere token de admin)
    getAllLoans(): Observable<LoanRequest[]> {
        return this.http.get<LoanRequest[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    // Obtener mis solicitudes (cliente autenticado)
    getMyLoans(): Observable<LoanRequest[]> {
        return this.http.get<LoanRequest[]>(`${this.apiUrl}/my`, { headers: this.getHeaders() });
    }

    // Obtener solicitud por ID
    getLoanById(id: string): Observable<LoanRequest> {
        return this.http.get<LoanRequest>(`${this.apiUrl}/${id}`);
    }

    // Actualizar estado de solicitud (requiere token de admin)
    updateLoanStatus(id: string, estado: 'APROBADA' | 'RECHAZADA'): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, { estado }, { headers: this.getHeaders() });
    }

    // Eliminar solicitud
    deleteLoan(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
