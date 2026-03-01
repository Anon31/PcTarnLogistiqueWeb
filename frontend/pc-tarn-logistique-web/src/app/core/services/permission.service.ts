import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private authService = inject(AuthService);

    // On récupère le rôle de l'utilisateur connecté (null s'il n'est pas connecté)
    readonly currentRole = computed(() => this.authService.userConnected()?.role ?? null);

    // On définit les rôles de base pour faciliter la lecture
    readonly isAdmin = computed(() => this.currentRole() === 'ADMIN');
    readonly isManager = computed(() => this.currentRole() === 'MANAGER');
    readonly isBenevole = computed(() => this.currentRole() === 'BENEVOLE');

    // On crée des permissions hiérarchisées (Granularité)
    // C'est ICI que l'on peut définir toutes les règles métier de la Protection Civile

    // Qui a le droit d'accéder à la page et voir la liste des utilisateurs ? (Admin ET Manager)
    readonly canViewUsers = computed(() => this.isAdmin() || this.isManager());
    // Qui peut gérer les utilisateurs ? (Seul l'Admin)
    readonly canManageUsers = computed(() => this.isAdmin());
    // Qui peut gérer l'inventaire ? (Admin ET Manager)
    readonly canManageInventory = computed(() => this.isAdmin() || this.isManager());
    // Qui peut voir les contrôles de lots ? (Tout le monde)
    readonly canViewBatches = computed(() => this.currentRole() !== null);
}
