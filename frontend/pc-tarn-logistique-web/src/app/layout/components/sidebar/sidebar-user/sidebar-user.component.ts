import { AuthService } from '../../../../core/services/auth.service';
import { RoleLabelPipe } from '../../../../shared/pipes/role-label.pipe';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-sidebar-user',
    imports: [Button, RoleLabelPipe, RouterLink],
    templateUrl: './sidebar-user.component.html',
    styleUrl: './sidebar-user.component.css',
})
export class SidebarUserComponent {
    public authService = inject(AuthService);
}
