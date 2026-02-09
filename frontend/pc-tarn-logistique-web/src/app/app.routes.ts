import { PageNotFoundComponent } from './views/pages/page-not-found/page-not-found.component';
import { LoginComponent } from './views/pages/login/login.component';
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
        component: LoginComponent,
    },
    {
        path: '',
        loadChildren: () =>
            import('./views/layout/main-layout.routes').then((m) => m.mainLayoutRoutes),
    },
    {
        path: '**',
        title: 'Page non trouvée',
        component: PageNotFoundComponent,
    },
];
