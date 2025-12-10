export interface LoanRequest {
    id: string;
    nombre: string;
    dni: string;
    ingreso: number;
    monto: number;
    plazo: number;
    estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}