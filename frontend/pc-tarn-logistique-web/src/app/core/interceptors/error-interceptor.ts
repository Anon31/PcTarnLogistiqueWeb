import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../services/toaster.service';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toasterService = inject(ToasterService);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Cas 1 : Non autorisé (Token expiré ou invalide)
            if (error.status === 401) {
                // On évite d'afficher l'erreur 401 si on est déjà sur la page de login
                if (!req.url.includes('/auth/login')) {
                    toasterService.error('Session expirée', 'Veuillez vous reconnecter.');
                    authService.logout();
                }
            }
            // Cas 2 : Accès refusé (RBAC - L'utilisateur n'a pas le bon rôle)
            else if (error.status === 403) {
                toasterService.error(
                    'Accès refusé',
                    "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
                );
            }
            // Cas 3 : Le serveur est éteint ou inaccessible (Hors ligne)
            else if (error.status === 0) {
                toasterService.error(
                    'Erreur réseau',
                    'Impossible de joindre le serveur. Vérifiez votre connexion.',
                );
            }
            // Cas 4 : Erreurs métiers renvoyées par le backend NestJS (ex: P2002 Doublon)
            else if (error.error?.message) {
                // NestJS peut renvoyer un tableau de messages (class-validator) ou une string
                const message = Array.isArray(error.error.message)
                    ? error.error.message.join(', ')
                    : error.error.message;

                toasterService.error('Erreur', message);
            }
            // Cas par défaut
            else {
                toasterService.error('Erreur inattendue', 'Une erreur technique est survenue.');
            }

            // On relance l'erreur pour que les composants puissent tout de même
            // la "catcher" s'ils ont besoin de faire une action spécifique (ex: arrêter un spinner de bouton)
            return throwError(() => error);
        }),
    );
};
