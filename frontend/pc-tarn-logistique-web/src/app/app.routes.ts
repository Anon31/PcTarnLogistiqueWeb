import { authGuard } from './core/guards/auth-guard';
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
        loadComponent: () =>
            import('./views/pages/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./views/layout/main-layout.routes').then((m) => m.mainLayoutRoutes),
    },
    {
        path: '**',
        title: 'Page non trouvée',
        loadComponent: () =>
            import('./views/pages/page-not-found/page-not-found.component').then(
                (m) => m.PageNotFoundComponent,
            ),
    },
];
