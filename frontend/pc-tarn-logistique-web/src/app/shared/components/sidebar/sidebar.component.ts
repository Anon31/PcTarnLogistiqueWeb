import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SidebarService } from '../../../core/services/sidebar.service';
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
        SidebarUserComponent,
        SidebarMenuComponent,
        SidebarHeaderComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
    sidebarService = inject(SidebarService);
    appVersion: string = '1.0.0';

    onDrawerHide() {
        this.sidebarService.setOpen(false);
    }
}
