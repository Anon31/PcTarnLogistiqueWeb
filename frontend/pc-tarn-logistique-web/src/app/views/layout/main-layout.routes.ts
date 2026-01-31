import { Routes } from '@angular/router';
import { MainLayout } from './main-layout/main-layout';

export const mainLayoutRoutes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'accueil',
                title: 'Accueil',
                data: {},
                loadComponent: () => import('./../pages/home/home').then((m) => m.Home),
            },
            // {
            //     path: 'administration',
            //     title: 'Administration',
            //     children: adminRoutes,
            // },
        ],
    },
];
