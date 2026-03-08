import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../../core/services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service'; // Ajuste le chemin si besoin

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, ToolbarModule, ButtonModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    sidebarService = inject(SidebarService);
    public authService = inject(AuthService);

    // État local du bouton pour savoir quelle icône afficher
    isDarkMode = false;

    /**
     * Au montage du Header, on regarde quel est le thème actuel
     * pour afficher la bonne icône (soleil ou lune)
     */
    ngOnInit() {
        const storedTheme = localStorage.getItem('THEME');
        this.isDarkMode = storedTheme === 'dark';
    }

    /**
     * Action du bouton : Bascule entre le mode Clair et Sombre avec sauvegarde
     */
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;

        const html = document.documentElement;
        if (this.isDarkMode) {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }

        localStorage.setItem('THEME', this.isDarkMode ? 'dark' : 'light');
    }
}
