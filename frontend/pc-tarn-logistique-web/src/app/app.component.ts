import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [ButtonModule, LoadingSpinnerComponent, RouterOutlet, Toast],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    protected readonly title = signal('pc-tarn-logistique-web');

    /**
     * S'exécute au tout premier lancement de l'application.
     * Restaure le thème choisi par l'utilisateur.
     */
    ngOnInit() {
        const storedTheme = localStorage.getItem('THEME');
        const isDark = storedTheme === 'dark';

        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }
    }
}
