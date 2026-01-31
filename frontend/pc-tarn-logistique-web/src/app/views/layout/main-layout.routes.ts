import { MainLayout } from './main-layout/main-layout';
import { Routes } from '@angular/router';

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
        ],
    },
];
