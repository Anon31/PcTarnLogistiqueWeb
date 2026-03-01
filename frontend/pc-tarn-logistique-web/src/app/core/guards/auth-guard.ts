import { ToasterService } from '../services/toaster.service';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    if (authService.isAuthenticated()) {
        return true;
    }

    toasterService.error('Accès refusé', "Veuillez vous connecter pour accéder à l'application.");
    router.navigate(['/connexion']);
    return false;
};
