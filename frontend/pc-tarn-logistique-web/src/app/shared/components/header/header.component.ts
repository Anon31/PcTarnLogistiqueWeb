import { SidebarService } from '../../../core/services/sidebar.service';
import { Component, inject } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-header',
    imports: [Toolbar, Button, IconField, InputIcon, InputText],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    protected sidebarService = inject(SidebarService);
}
