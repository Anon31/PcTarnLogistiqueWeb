import { SidebarService } from '../../../core/services/sidebar.service';
import { SidebarHeader } from './sidebar-header/sidebar-header';
import { SidebarMenu } from './sidebar-menu/sidebar-menu';
import { SidebarUser } from './sidebar-user/sidebar-user';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-sidebar',
    imports: [
        DrawerModule,
        NgTemplateOutlet,
        PanelMenuModule,
        SidebarUser,
        SidebarMenu,
        SidebarHeader,
    ],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class Sidebar {
    sidebarService = inject(SidebarService);
    appVersion: string = '1.0.0';

    onDrawerHide() {
        this.sidebarService.setOpen(false);
    }
}
