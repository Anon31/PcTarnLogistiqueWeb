import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toExclude = '/auth/login';
    /**
     * Si la requête n'est pas pour le login, ajouter le token JWT dans les en-têtes
     */
    if (req.url.search(toExclude) === -1) {
        let jwt = authService.getToken();
        let reqWithToken = req.clone({
            setHeaders: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return next(reqWithToken);
    }
    /**
     * Sinon, continuer sans modifier la requête
     */
    return next(req);
};
