import { ToggleDarkMode } from './shared/components/toggle-dark-mode/toggle-dark-mode';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [ButtonModule, ToggleDarkMode, LoadingSpinner, RouterOutlet, Toast],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('pc-tarn-logistique-web');
}
