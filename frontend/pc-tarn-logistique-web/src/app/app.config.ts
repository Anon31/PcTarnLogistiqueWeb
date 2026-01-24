import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CustomTheme } from '../styles/themes/custom-theme';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
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
    ],
};
