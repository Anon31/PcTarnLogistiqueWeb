import { PermissionService } from '../../../../core/services/permission.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { Component, inject, computed } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar-menu',
    imports: [PanelMenu],
    templateUrl: './sidebar-menu.component.html',
    styleUrl: './sidebar-menu.component.css',
})
export class SidebarMenuComponent {
    sidebarService = inject(SidebarService);
    permissionService = inject(PermissionService);

    // 🚀 MAGIE DES SIGNAUX : On transforme "items" en signal calculé.
    // Dès que canViewUsers() change en arrière-plan, le menu se redessine tout seul !
    items = computed<MenuItem[]>(() => [
        {
            label: 'Tableau de bord',
            icon: 'pi pi-th-large',
            routerLink: '/tableau-de-bord',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Utilisateurs',
            visible: this.permissionService.canViewUsers(), // 🔒 Condition RBAC ici !
            icon: 'pi pi-users',
            routerLink: '/utilisateurs',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Gestion des stocks',
            visible: this.permissionService.canManageInventory(), // Exemple si tu veux cacher les stocks aux bénévoles
            icon: 'pi pi-box',
            routerLink: '/stocks',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Contrôle des lots',
            icon: 'pi pi-check-square',
            routerLink: '/lots',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Suivi des véhicules',
            icon: 'pi pi-truck',
            routerLink: '/vehicules',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Signalements',
            icon: 'pi pi-exclamation-circle',
            routerLink: '/signalements',
            command: () => this.closeSidebar(),
        },
        {
            label: 'Messagerie',
            icon: 'pi pi-envelope',
            routerLink: '/messagerie',
            command: () => this.closeSidebar(),
        },
    ]);

    closeSidebar() {
        this.sidebarService.setOpen(false);
    }
}
