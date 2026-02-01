import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SplitButton } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [Toolbar, Button, IconField, InputIcon, InputText, SplitButton, RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header {
    public authService = inject(AuthService);
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
            },
        ];
    }
}
