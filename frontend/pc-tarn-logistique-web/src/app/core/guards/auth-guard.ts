import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

/**
 * Ce guard vérifie que l'utilisateur est authentifié avant de lui permettre d'accéder à une route protégée.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion et un message d'erreur est affiché.
 * @param route
 * @param state
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    if (authService.isAuthenticated()) {
        return true;
    }

    toasterService.error('Accès refusé', "Veuillez vous connecter pour accéder à l'application.");
    // Redirection vers la page de connexion
    router.navigate(['/connexion']);
    return false;
};
