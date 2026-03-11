import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    inject,
    provideAppInitializer,
} from '@angular/core';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import { EnumsDataService } from './core/enums/services/enums-data.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { tokenInterceptor } from './core/interceptors/token-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomTheme } from '../styles/themes/custom-theme';
import { DialogService } from 'primeng/dynamicdialog';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptors([loadingInterceptor, tokenInterceptor, errorInterceptor]),
        ),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withComponentInputBinding()),
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
        ConfirmationService,
        provideAppInitializer(() => inject(EnumsDataService).loadReferenceData()),
    ],
};
