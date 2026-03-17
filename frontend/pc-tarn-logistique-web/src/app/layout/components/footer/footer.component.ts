import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    // Gestion du statut réseau (Signal réactif)
    isOnline = signal<boolean>(navigator.onLine);

    /**
     * Écouteurs d'événements natifs pour détecter la perte ou le retour du réseau (Wi-Fi/4G)
     */
    @HostListener('window:online')
    onNetworkOnline() {
        this.isOnline.set(true);
    }

    @HostListener('window:offline')
    onNetworkOffline() {
        this.isOnline.set(false);
    }
}
