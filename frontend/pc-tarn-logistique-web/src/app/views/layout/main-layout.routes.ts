import { adminRoutes } from '../pages/admin/admin.routes';
import { MainLayout } from './main-layout/main-layout';
import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                data: {},
                loadComponent: () =>
                    import('./../pages/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'gestion-stocks',
                title: 'Gestion des stocks',
                data: {},
                loadComponent: () => import('./../pages/stock/stock').then((m) => m.Stock),
            },
            {
                path: 'controle-lots',
                title: 'Contrôle des lots',
                data: {},
                loadComponent: () =>
                    import('./../pages/batch-control/batch-control').then((m) => m.BatchControl),
            },
            {
                path: 'suivi-vehicules',
                title: 'Suivi des véhicules',
                data: {},
                loadComponent: () =>
                    import('./../pages/vehicle-tracking/vehicle-tracking').then(
                        (m) => m.VehicleTracking,
                    ),
            },
            {
                path: 'signalements',
                title: 'Signalements',
                data: {},
                loadComponent: () => import('./../pages/reports/reports').then((m) => m.Reports),
            },
            {
                path: 'messagerie',
                title: 'Messagerie',
                data: {},
                loadComponent: () =>
                    import('./../pages/messaging/messaging').then((m) => m.Messaging),
            },
            {
                path: 'administration',
                title: 'Administration',
                children: adminRoutes,
            },
        ],
    },
];
