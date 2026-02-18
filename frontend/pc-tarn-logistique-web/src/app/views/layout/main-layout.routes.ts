import { Routes } from '@angular/router';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
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
                children: [
                    {
                        path: '',
                        redirectTo: 'rechercher',
                        pathMatch: 'full',
                    },
                    {
                        path: 'rechercher',
                        title: 'Rechercher un utilisateur',
                        loadComponent: () =>
                            import('./../pages/user/user-list/user-list.component').then(
                                (m) => m.UserListComponent,
                            ),
                    },
                    {
                        path: 'creer',
                        title: 'Créer un utilisateur',
                        loadComponent: () =>
                            import('./../pages/user/user-create/user-create.component').then(
                                (m) => m.UserCreateComponent,
                            ),
                    },
                ],
            },
            {
                path: 'stocks',
                title: 'Gestion des stocks',
                loadComponent: () =>
                    import('./../pages/stock/stock.component').then((m) => m.StockComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'rechercher',
                        pathMatch: 'full',
                    },
                    {
                        path: 'rechercher',
                        title: 'Rechercher un article',
                        loadComponent: () =>
                            import('./../pages/stock/stock-list.component/stock-list.component').then(
                                (m) => m.StockListComponent,
                            ),
                    },
                    {
                        path: 'creer',
                        title: 'Créer un article',
                        loadComponent: () =>
                            import('./../pages/stock/stock-create.component/stock-create.component').then(
                                (m) => m.StockCreateComponent,
                            ),
                    },
                ],
            },
            {
                path: 'lots',
                title: 'Contrôle des lots',
                loadComponent: () =>
                    import('./../pages/batch-control/batch-control.component').then(
                        (m) => m.BatchControlComponent,
                    ),
                children: [
                    {
                        path: '',
                        redirectTo: 'controler',
                        pathMatch: 'full',
                    },
                    {
                        path: 'controler',
                        title: 'Lancer un contrôle de lot',
                        loadComponent: () =>
                            import('./../pages/batch-control/batch-control-list/batch-control-list.component').then(
                                (m) => m.BatchControlListComponent,
                            ),
                    },
                ],
            },
            {
                path: 'vehicules',
                title: 'Suivi des véhicules',
                loadComponent: () =>
                    import('./../pages/vehicle-tracking/vehicle-tracking.component').then(
                        (m) => m.VehicleTrackingComponent,
                    ),
                children: [
                    {
                        path: '',
                        redirectTo: 'rechercher',
                        pathMatch: 'full',
                    },
                    {
                        path: 'rechercher',
                        title: 'Rechercher, signaler ou créer un véhicule',
                        loadComponent: () =>
                            import('./../pages/vehicle-tracking/vehicle-tracking-home/vehicle-tracking-home').then(
                                (m) => m.VehicleTrackingHome,
                            ),
                    },
                ],
            },
            {
                path: 'signalements',
                title: 'Signalements',
                loadComponent: () =>
                    import('./../pages/report/report.component').then((m) => m.ReportComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'rechercher',
                        pathMatch: 'full',
                    },
                    {
                        path: 'rechercher',
                        title: 'Rechercher un signalement',
                        loadComponent: () =>
                            import('./../pages/report/report-list/report-list.component').then(
                                (m) => m.ReportListComponent,
                            ),
                    },
                ],
            },
            {
                path: 'messagerie',
                title: 'Messagerie',
                loadComponent: () =>
                    import('./../pages/messaging/messaging.component').then(
                        (m) => m.MessagingComponent,
                    ),
                children: [
                    {
                        path: '',
                        redirectTo: 'centre-de-messagerie',
                        pathMatch: 'full',
                    },
                    {
                        path: 'centre-de-messagerie',
                        title: 'Centre de messagerie',
                        loadComponent: () =>
                            import('./../pages/messaging/messaging-center/messaging-center').then(
                                (m) => m.MessagingCenter,
                            ),
                    },
                ],
            },
        ],
    },
];
