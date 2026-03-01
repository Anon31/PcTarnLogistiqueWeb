import { HttpInterceptorFn, HttpContextToken } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

// Ce code définit un intercepteur HTTP pour gérer l'affichage d'un loader lors des requêtes HTTP.
// Si besoin de faire une requête "invisible", il suffira de l'appeler ainsi dans les services :
// this.http.get('/api/sync', { context: new HttpContext().set(IGNORE_LOADING, true) })

// 1. On crée un "jeton" de contexte qui vaut "false" par défaut
export const IGNORE_LOADING = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // 2. On vérifie si la requête demande explicitement à être ignorée
    if (req.context.get(IGNORE_LOADING)) {
        return next(req); // On passe à la suite sans afficher le loader
    }

    // 3. Comportement standard : on affiche le loader
    loadingService.show();

    return next(req).pipe(finalize(() => loadingService.hide()));
};
