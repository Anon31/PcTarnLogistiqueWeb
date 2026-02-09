import { SidebarService } from '../../../../core/services/sidebar.service';
import { Component, inject, OnInit } from '@angular/core';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar-menu',
    imports: [PanelMenu],
    templateUrl: './sidebar-menu.html',
    styleUrl: './sidebar-menu.css',
})
export class SidebarMenu implements OnInit {
    sidebarService = inject(SidebarService);
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Tableau de bord',
                icon: 'pi pi-th-large',
                routerLink: '/tableau-de-bord',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Utilisateurs',
                icon: 'pi pi-users',
                routerLink: '/utilisateurs',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Gestion des stocks',
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
        ];
    }

    closeSidebar() {
        this.sidebarService.setOpen(false);
    }
}
