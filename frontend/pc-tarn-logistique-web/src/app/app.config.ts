import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token-interceptor';
import { CustomTheme } from '../styles/themes/custom-theme';
import { providePrimeNG } from 'primeng/config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([loadingInterceptor, tokenInterceptor])),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: CustomTheme,
                options: {
                    ripple: true,
                    darkModeSelector: '.dark-mode',
                },
            },
        }),
        MessageService,
        DialogService,
    ],
};
