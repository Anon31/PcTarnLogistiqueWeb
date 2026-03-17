import { usersGuard } from '../core/guards/users-guard';
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
                    import('../features/dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent,
                    ),
            },
            {
                path: 'mon-compte',
                title: 'Mes paramètres utilisateur',
                loadComponent: () =>
                    import('../features/users/pages/user-account/user-account.component').then(
                        (m) => m.UserAccountComponent,
                    ),
            },
            {
                path: 'utilisateurs',
                title: 'Utilisateurs',
                canActivate: [usersGuard], // 🔒 Protection de la route avec le guard RBAC
                loadComponent: () =>
                    import('../features/users/users.component').then((m) => m.UsersComponent),
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
                            import('../features/users/pages/user-list/user-list.component').then(
                                (m) => m.UserListComponent,
                            ),
                    },
                    {
                        path: 'creer',
                        title: 'Créer un utilisateur',
                        loadComponent: () =>
                            import('../features/users/pages/user-create/user-create.component').then(
                                (m) => m.UserCreateComponent,
                            ),
                    },
                    {
                        path: 'compte/:id',
                        title: 'Détails du compte utilisateur',
                        loadComponent: () =>
                            import('../features/users/pages/user-editing/user-editing.component').then(
                                (m) => m.UserEditingComponent,
                            ),
                    },
                ],
            },
            {
                path: 'stocks',
                title: 'Gestion des stocks',
                loadComponent: () =>
                    import('../features/stock/stock.component').then((m) => m.StockComponent),
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
                            import('../features/stock/pages/stock-list.component/stock-list.component').then(
                                (m) => m.StockListComponent,
                            ),
                    },
                    {
                        path: 'creer',
                        title: 'Créer un article',
                        loadComponent: () =>
                            import('../features/stock/pages/stock-create.component/stock-create.component').then(
                                (m) => m.StockCreateComponent,
                            ),
                    },
                ],
            },
            {
                path: 'lots',
                title: 'Contrôle des lots',
                loadComponent: () =>
                    import('../features/batch-control/batch-control.component').then(
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
                            import('../features/batch-control/pages/batch-control-list/batch-control-list.component').then(
                                (m) => m.BatchControlListComponent,
                            ),
                    },
                ],
            },
            {
                path: 'vehicules',
                title: 'Suivi des véhicules',
                loadComponent: () =>
                    import('../features/vehicle-tracking/vehicle-tracking.component').then(
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
                            import('../features/vehicle-tracking/pages/vehicle-tracking-home/vehicle-tracking-home').then(
                                (m) => m.VehicleTrackingHome,
                            ),
                    },
                ],
            },
            {
                path: 'signalements',
                title: 'Signalements',
                loadComponent: () =>
                    import('../features/report/report.component').then((m) => m.ReportComponent),
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
                            import('../features/report/pages/report-list/report-list.component').then(
                                (m) => m.ReportListComponent,
                            ),
                    },
                ],
            },
            {
                path: 'messagerie',
                title: 'Messagerie',
                loadComponent: () =>
                    import('../features/messaging/messaging.component').then(
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
                            import('../features/messaging/pages/messaging-center/messaging-center').then(
                                (m) => m.MessagingCenter,
                            ),
                    },
                ],
            },
            {
                path: 'charte-informatique',
                title: 'Charte informatique',
                loadComponent: () =>
                    import('../features/legal/pages/it-charter/it-charter.component').then(
                        (m) => m.ItCharterComponent,
                    ),
            },
            {
                path: 'politique-rgpd',
                title: 'Politique RGPD',
                loadComponent: () =>
                    import('../features/legal/pages/rgpd-policy/rgpd-policy.component').then(
                        (m) => m.RgpdPolicyComponent,
                    ),
            },
        ],
    },
];
