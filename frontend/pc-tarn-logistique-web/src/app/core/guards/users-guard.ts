import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToasterService } from '../services/toaster.service';
import { PermissionService } from '../services/permission.service';

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
