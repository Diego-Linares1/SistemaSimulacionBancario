import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface LogEntry {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  private http = inject(HttpClient);

  logs = signal<LogEntry[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading.set(true);
    this.error.set(null);

    // Simulación de logs (en producción vendría del backend)
    setTimeout(() => {
      const mockLogs: LogEntry[] = [
        {
          id: 1,
          action: 'LOGIN',
          user: 'admin',
          timestamp: new Date().toISOString(),
          details: 'Inicio de sesión exitoso'
        },
        {
          id: 2,
          action: 'CREATE_USER',
          user: 'admin',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Usuario "cliente2" creado con rol cliente'
        },
        {
          id: 3,
          action: 'APPROVE_LOAN',
          user: 'analista',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'Solicitud #123 aprobada'
        },
        {
          id: 4,
          action: 'CREATE_LOAN',
          user: 'cliente',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          details: 'Nueva solicitud de préstamo por $10,000'
        }
      ];

      this.logs.set(mockLogs);
      this.loading.set(false);
    }, 500);
  }
}
