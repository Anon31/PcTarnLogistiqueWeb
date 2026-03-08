import { EnumsDataService } from '../../../../core/enums/services/enums-data.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { Component, DestroyRef, inject, OnInit, computed } from '@angular/core';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
import { IUserDto, IUserPayload } from '../../../../shared/interfaces/user';
import { ToasterService } from '../../../../core/services/toaster.service';
import { UserService } from '../../../../core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-table-user',
    imports: [
        Tag,
        TableModule,
        InputText,
        FormsModule,
        Select,
        Button,
        EnumsDynamicPipe,
        ConfirmPopup,
        RouterLink,
    ],
    providers: [EnumsDynamicPipe],
    templateUrl: './table-user.component.html',
    styleUrl: './table-user.component.css',
})
export class TableUserComponent implements OnInit {
    userService = inject(UserService);
    toasterService = inject(ToasterService);
    confirmationService = inject(ConfirmationService);
    permissionService = inject(PermissionService);
    enumsData = inject(EnumsDataService);
    enumsPipe = inject(EnumsDynamicPipe);
    destroyRef = inject(DestroyRef);

    // Pour gérer l'annulation de l'édition (rollback)
    clonedUsers: { [s: string]: IUserDto } = {};

    rolesOptions = computed(() => {
        // 1. On récupère l'objet envoyé par le backend (ex: { ADMIN: "ADMIN", BENEVOLE: "BENEVOLE" })
        const backendRoles = this.enumsData.enumsData()?.roles || {};
        console.log('Rôles bruts du backend :', backendRoles);
        // 2. On transforme cet objet en tableau pour PrimeNG : [{label: '...', value: '...'}]
        return Object.values(backendRoles).map((roleValue) => ({
            label: this.enumsPipe.transform(roleValue as string),
            value: roleValue,
        }));
    });

    ngOnInit() {
        this.userService.getAllUsers();
    }

    /**
     * Lors de l'initialisation de l'édition d'une ligne, on clone l'utilisateur dans un objet temporaire.
     * @param user
     */
    onRowEditInit(user: IUserDto) {
        this.clonedUsers[user.id] = { ...user };
    }

    /**
     * Lors de la sauvegarde de l'édition, on compare l'utilisateur modifié avec le clone original
     * pour construire un payload de mise à jour partielle.
     * @param user
     */
    onRowEditSave(user: IUserDto) {
        const original = this.clonedUsers[user.id];

        // Payload partiel typé
        const payload: Partial<IUserPayload> = {};

        // Comparaison champ par champ
        if (user.firstname !== original.firstname) payload.firstname = user.firstname;
        if (user.lastname !== original.lastname) payload.lastname = user.lastname;
        if (user.email !== original.email) payload.email = user.email;
        if (user.phone !== original.phone) payload.phone = user.phone;
        if (user.role !== original.role) payload.role = user.role;

        console.log('Payload Patch envoyé :', payload);

        // Appel au service avec gestion de la souscription
        this.userService
            .patchUser(user.id, payload)
            .pipe(
                // Sécurité : Si le composant est détruit pendant la requête, on annule tout
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (updatedUser) => {
                    this.toasterService.success(
                        '✅ Mise à jour réussie',
                        `Le profil de ${user.firstname} a été modifié.`,
                    );
                    delete this.clonedUsers[user.id];
                },
                error: (err) => {
                    console.log('Erreur lors de la mise à jour :', err);
                    this.onRowEditCancel(user, -1);
                },
            });
    }

    /**
     * En cas d'annulation de l'édition, on restaure les données originales à partir du clone et on supprime le clone.
     * @param user
     * @param index
     */
    onRowEditCancel(user: IUserDto, index: number) {
        this.userService.rollbackUserUpdate(index, this.clonedUsers[user.id]);
        delete this.clonedUsers[user.id];
    }

    /**
     * Affiche une confirmation avant de supprimer un utilisateur. Si confirmé, envoie la requête de suppression.
     * @param event
     * @param id
     */
    onDelete(event: Event, id: number) {
        event.stopPropagation(); // IMPORTANT : Empêche l'interférence avec la ligne du tableau

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message:
                'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
            icon: 'pi pi-info-circle', // Icône rouge pour appuyer le danger
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',

            // 🚀 API Moderne : Hérite de ton thème de boutons
            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
                size: 'small',
                rounded: true,
            },
            acceptButtonProps: {
                severity: 'danger', // Applique le rouge natif
                size: 'small',
                rounded: true,
                raised: true,
            },

            accept: () => {
                this.userService.deleteUser(id).subscribe({
                    next: () => {
                        this.toasterService.success(
                            'Suppression réussie',
                            "L'utilisateur a bien été retiré de la base.",
                        );
                    },
                    error: (err) => {
                        console.error('Erreur Delete:', err);
                    },
                });
            },
        });
    }
}
