import { ToggleDarkModeComponent } from './shared/components/toggle-dark-mode/toggle-dark-mode.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [ButtonModule, ToggleDarkModeComponent, LoadingSpinnerComponent, RouterOutlet, Toast],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    protected readonly title = signal('pc-tarn-logistique-web');
}
