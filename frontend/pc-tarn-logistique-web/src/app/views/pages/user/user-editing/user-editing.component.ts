import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { FormUserComponent } from '../../../components/forms/form-user/form-user.component';
import { IUserDto, IUserPayload } from '../../../../shared/interfaces/user';
import { ToasterService } from '../../../../core/services/toaster.service';
import { Component, inject, input, effect, signal } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-editing',
    standalone: true,
    imports: [PageCardWrapperComponent, FormUserComponent],
    templateUrl: './user-editing.component.html',
    styleUrl: './user-editing.component.css',
})
export class UserEditingComponent {
    private userService = inject(UserService);
    private toaster = inject(ToasterService);
    private router = inject(Router);

    // 🚀 L'ID est récupéré depuis l'URL /utilisateurs/compte/:id
    id = input<string>();

    // Utilisateur en cours de chargement
    loadedUser = signal<IUserDto | null>(null);

    constructor() {
        effect(() => {
            const currentId = this.id();
            if (currentId) {
                this.userService.getUserById(Number(currentId)).subscribe({
                    next: (user) => this.loadedUser.set(user),
                    error: () => this.router.navigate(['/utilisateurs/rechercher']),
                });
            }
        });
    }

    onUpdate(payload: IUserPayload) {
        const userId = this.loadedUser()?.id;

        if (!userId) return;

        this.userService.patchUser(userId, payload).subscribe({
            next: () => {
                this.router.navigate(['/utilisateurs/rechercher']).then(() => {
                    this.toaster.success(
                        'Mise à jour réussie',
                        'Les informations ont été modifiées.',
                    );
                });
            },
        });
    }

    onCancel() {
        this.router.navigate(['/utilisateurs/rechercher']);
    }
}
