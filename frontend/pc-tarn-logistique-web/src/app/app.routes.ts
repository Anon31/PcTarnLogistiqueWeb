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
            import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: '',
        canActivate: [authGuard],
        loadChildren: () => import('./layout/main-layout.routes').then((m) => m.mainLayoutRoutes),
    },
    {
        path: '**',
        title: 'Page non trouvée',
        loadComponent: () =>
            import('./core/pages/page-not-found/page-not-found.component').then(
                (m) => m.PageNotFoundComponent,
            ),
    },
];
