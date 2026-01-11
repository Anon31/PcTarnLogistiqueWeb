import { ToggleDarkMode } from './shared/components/toggle-dark-mode/toggle-dark-mode';
import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-root',
    imports: [ButtonModule, ToggleDarkMode],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('pc-tarn-logistique-web');
}
