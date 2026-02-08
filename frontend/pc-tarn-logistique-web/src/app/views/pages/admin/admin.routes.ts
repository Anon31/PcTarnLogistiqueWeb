import { Routes } from '@angular/router';
import { Admin } from './admin';

export const adminRoutes: Routes = [
    {
        path: '',
        component: Admin,
        data: {},
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'utilisateurs',
            },
            {
                path: 'utilisateurs',
                title: 'Administration des utilisateurs',
                data: {},
                loadComponent: () => import('./admin-users/admin-users').then((m) => m.AdminUsers),
            },
            {
                path: 'stocks',
                title: 'Administration des stocks',
                data: {},
                loadComponent: () =>
                    import('./admin-stocks/admin-stocks').then((m) => m.AdminStocks),
            },
        ],
    },
];
