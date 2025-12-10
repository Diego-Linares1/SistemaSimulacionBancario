import { Routes } from '@angular/router';
import { adminGuard, authGuard, adminOnlyGuard, clientGuard, analistaGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component')
            .then(m => m.LoginComponent)
    },
    // Rutas de Cliente
    {
        path: 'solicitar',
        canActivate: [clientGuard],
        loadComponent: () => import('./features/client/request-form/request-form.component')
            .then(m => m.RequestFormComponent)
    },
    {
        path: 'mis-solicitudes',
        canActivate: [clientGuard],
        loadComponent: () => import('./features/client/loan-history/loan-history.component')
            .then(m => m.LoanHistoryComponent)
    },
    // Rutas de Analista
    {
        path: 'analista',
        canActivate: [analistaGuard],
        loadComponent: () => import('./features/analyst/request-table/request-table.component')
            .then(m => m.RequestTableComponent)
    },
    // Rutas de Admin
    {
        path: 'admin',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/admin/admin-panel/admin-panel.component')
            .then(m => m.AdminPanelComponent)
    },
    {
        path: 'admin/create-user',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/admin/create-user/create-user.component')
            .then(m => m.CreateUserComponent)
    },
    {
        path: 'admin/logs',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('./features/admin/logs/logs.component')
            .then(m => m.LogsComponent)
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];