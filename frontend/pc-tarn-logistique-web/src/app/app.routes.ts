import { PageNotFound } from './shared/components/page-not-found/page-not-found';
import { Login } from './views/pages/login/login';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'connexion',
    },
    {
        path: 'connexion',
        title: 'Connexion',
        component: Login,
    },
    {
        path: '',
        loadChildren: () =>
            import('./views/layout/main-layout.routes').then((m) => m.mainLayoutRoutes),
    },
    {
        path: '**',
        title: 'Page non trouvée',
        component: PageNotFound,
    },
];
