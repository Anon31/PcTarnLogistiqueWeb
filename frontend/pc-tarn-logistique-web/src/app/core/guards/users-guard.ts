import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { PermissionService } from '../services/permission.service';

/**
 * Ce guard vérifie que l'utilisateur a la permission de voir les utilisateurs (généralement les Managers et Admins).
 * Si l'utilisateur n'a pas la permission, il est redirigé vers le tableau de bord et un message d'erreur est affiché.
 * @param route
 * @param state
 */
export const usersGuard: CanActivateFn = (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    const toasterService = inject(ToasterService);

    // On utilise la permission "Lecture" pour laisser entrer les Managers et les Admins
    if (permissionService.canViewUsers()) {
        return true;
    }

    toasterService.error('Accès refusé', "Vous n'avez pas les droits pour consulter l'annuaire.");
    router.navigate(['/tableau-de-bord']);
    return false;
};
