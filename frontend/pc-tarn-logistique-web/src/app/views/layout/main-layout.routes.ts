import { MainLayout } from './main-layout/main-layout';
import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'tableau-de-bord',
                title: 'Tableau de bord',
                loadComponent: () =>
                    import('./../pages/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent,
                    ),
            },
            {
                path: 'utilisateurs',
                title: 'Utilisateurs',
                loadComponent: () =>
                    import('./../pages/user/user.component').then((m) => m.UserComponent),
            },
            {
                path: 'stocks',
                title: 'Gestion des stocks',
                loadComponent: () =>
                    import('./../pages/stock/stock.component').then((m) => m.StockComponent),
            },
            {
                path: 'lots',
                title: 'Contrôle des lots',
                loadComponent: () =>
                    import('./../pages/batch-control/batch-control.component').then(
                        (m) => m.BatchControlComponent,
                    ),
            },
            {
                path: 'vehicules',
                title: 'Suivi des véhicules',
                loadComponent: () =>
                    import('./../pages/vehicle-tracking/vehicle-tracking.component').then(
                        (m) => m.VehicleTrackingComponent,
                    ),
            },
            {
                path: 'signalements',
                title: 'Signalements',
                loadComponent: () =>
                    import('./../pages/report/report.component').then((m) => m.ReportComponent),
            },
            {
                path: 'messagerie',
                title: 'Messagerie',
                loadComponent: () =>
                    import('./../pages/messaging/messaging.component').then(
                        (m) => m.MessagingComponent,
                    ),
            },
        ],
    },
];
