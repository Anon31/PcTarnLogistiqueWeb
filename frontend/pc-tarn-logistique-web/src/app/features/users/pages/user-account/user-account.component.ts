import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { UserFormPasswordComponent } from '../../components/user-form-password/user-form-password.component';
import { IUserDto, IUserPayload, IUserUpdatePasswordPayload } from '../../models/user.model';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, effect, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-account',
    providers: [DialogService],
    imports: [PageCardWrapperComponent, UserFormComponent],
    templateUrl: './user-account.component.html',
})
export class UserAccountComponent {
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly toaster = inject(ToasterService);
    private readonly dialogService = inject(DialogService);
    private dialogRef!: DynamicDialogRef<any> | null;

    fullUserProfile = signal<IUserDto | null>(null);

    constructor() {
        // 💡 ARCHITECTURE : Utilisation de `effect()` d'Angular
        // Contrairement à ngOnInit, un `effect()` surveille automatiquement tous les Signaux qu'il contient.
        // Ici, il observe `this.authService.userConnected()`.
        // Déclenchement : Dès que le token d'authentification est parsé et que le signal
        // a une valeur (ou s'il vient à changer), l'effet s'exécute automatiquement pour
        // aller charger le DTO du profil complet (incluant l'adresse, le téléphone, etc.).
        // C'est une approche beaucoup plus réactive !
        effect(() => {
            const authUserId = this.authService.userConnected()?.id;
            if (authUserId) {
                this.userService
                    .getUserById(authUserId)
                    .subscribe((user) => this.fullUserProfile.set(user));
            }
        });
    }

    onUpdateProfile(payload: IUserPayload) {
        const userId = this.authService.userConnected()?.id;
        if (!userId) return;

        this.userService.patchUser(userId, payload).subscribe({
            next: () => this.toaster.success('Succès', 'Informations mises à jour.'),
        });
    }

    /**
     * Ouverture de la modale dynamique
     */
    openPasswordDialog() {
        this.dialogRef = this.dialogService.open(UserFormPasswordComponent, {
            header: 'Modification du mot de passe',
            width: '25rem',
            modal: true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
        });

        // Abonnement à la fermeture de la modale pour récupérer les données du formulaire
        this.dialogRef?.onClose.subscribe(
            (passwordPayload: IUserUpdatePasswordPayload | undefined) => {
                if (passwordPayload) {
                    this.onChangePassword(passwordPayload);
                }
            },
        );
    }

    onCancel() {
        this.router.navigate(['/tableau-de-bord']).then();
    }

    /**
     * Appel API pour changer le mot de passe de l'utilisateur connecté
     * @param passwordPayload
     * @private
     */
    private onChangePassword(passwordPayload: IUserUpdatePasswordPayload) {
        this.userService.updateMyPassword(passwordPayload).subscribe({
            next: () => {
                this.toaster.success('Sécurité', 'Mot de passe mis à jour avec succès.');
            },
        });
    }
}
