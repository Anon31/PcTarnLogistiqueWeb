import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toExclude = '/auth/login';
    // Check if the request URL does not contain the login path
    if (req.url.search(toExclude) === -1) {
        let jwt = authService.getToken();
        let reqWithToken = req.clone({
            setHeaders: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        return next(reqWithToken);
    }
    // If the request is for login, just pass it through without adding the token
    return next(req);
};
