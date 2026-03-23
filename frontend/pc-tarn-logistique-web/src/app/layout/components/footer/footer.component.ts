import { Component, HostListener, inject, signal } from '@angular/core';
import { SystemService } from '../../../core/services/system.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './footer.component.html',
})
export class FooterComponent {
    // Injection du service pour interroger le backend
    private systemService = inject(SystemService);

    // Signal réactif (Angular gère la souscription)
    status = toSignal(this.systemService.getSystemStatus());

    // Gestion du statut réseau natif du navigateur (Signal réactif)
    isOnline = signal<boolean>(navigator.onLine);

    @HostListener('window:online')
    onNetworkOnline() {
        this.isOnline.set(true);
    }

    @HostListener('window:offline')
    onNetworkOffline() {
        this.isOnline.set(false);
    }
}
