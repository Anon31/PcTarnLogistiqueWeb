import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-toggle-dark-mode',
    imports: [Button],
    templateUrl: './toggle-dark-mode.component.html',
    styleUrl: './toggle-dark-mode.component.css',
})
export class ToggleDarkModeComponent implements OnInit {
    isDarkMode = false;

    ngOnInit() {
        const storedTheme = localStorage.getItem('THEME');
        this.isDarkMode = storedTheme === 'dark'; // Dark mode is enabled if the stored value is 'dark'

        const html = document.querySelector('html');
        if (html) {
            html.classList.toggle('dark-mode', this.isDarkMode);
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;

        const html = document.querySelector('html');
        if (html) {
            html.classList.toggle('dark-mode', this.isDarkMode);
        }

        localStorage.setItem('THEME', this.isDarkMode ? 'dark' : 'light');
    }
}
