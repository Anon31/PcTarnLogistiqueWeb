import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { CustomTheme } from '../styles/themes/custom-theme';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
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
