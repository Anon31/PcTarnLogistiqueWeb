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
                icon: 'pi pi-fw pi-th-large',
                routerLink: '/dashboard',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Gestion des stocks',
                icon: 'pi pi-fw pi-box',
                routerLink: '/stocks',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Contrôle des lots',
                icon: 'pi pi-fw pi-check-square',
                routerLink: '/lots',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Suivi des véhicules',
                icon: 'pi pi-fw pi-truck',
                routerLink: '/vehicules',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Signalements',
                icon: 'pi pi-fw pi-exclamation-circle',
                routerLink: '/signalements',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Messagerie',
                icon: 'pi pi-envelope',
                routerLink: '/messagerie',
                command: () => this.closeSidebar(),
            },
            {
                label: 'Administration',
                icon: 'pi pi-cog',
                items: [
                    {
                        label: 'Utilisateurs',
                        icon: 'pi pi-fw pi-users',
                        routerLink: '/admin/users',
                        command: () => this.closeSidebar(),
                    },
                    {
                        label: 'Rôles & Droits',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: '/admin/roles',
                        command: () => this.closeSidebar(),
                    },
                ],
            },
        ];
    }

    closeSidebar() {
        this.sidebarService.setOpen(false);
    }
}
