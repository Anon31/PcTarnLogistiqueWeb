import { SidebarService } from '../../../../core/services/sidebar.service';
import { Component, inject, OnInit } from '@angular/core';
import { ClassNames } from 'primeng/classnames';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-sidebar-menu',
    imports: [ClassNames, PanelMenu],
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
                label: 'Administration',
                icon: 'pi pi-fw pi-cog',
                routerLink: '/signalements',
                command: () => this.closeSidebar(),
            },
        ];
    }

    closeSidebar() {
        this.sidebarService.setOpen(false);
    }
}
