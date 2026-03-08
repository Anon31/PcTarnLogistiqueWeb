import { AuthService } from '../../../../core/services/auth.service';
import { RoleLabelPipe } from '../../../pipes/role-label.pipe';
import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar-user',
    imports: [Button, RoleLabelPipe, RouterLink],
    templateUrl: './sidebar-user.component.html',
    styleUrl: './sidebar-user.component.css',
})
export class SidebarUserComponent {
    public authService = inject(AuthService);
}
