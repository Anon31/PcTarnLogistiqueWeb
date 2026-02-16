import { IUserDto, IUserPayload } from '../../../../shared/interfaces/user';
import { RoleLabelPipe } from '../../../../shared/pipes/role-label.pipe';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-table-user',
    imports: [Tag, TableModule, InputText, FormsModule, Select, Button, RoleLabelPipe],
    templateUrl: './table-user.component.html',
    styleUrl: './table-user.component.css',
})
export class TableUserComponent implements OnInit {
    userService = inject(UserService);
    destroyRef = inject(DestroyRef);
    // Pour gérer l'annulation de l'édition (rollback)
    clonedUsers: { [s: string]: IUserDto } = {};

    // todo : idéalement, ces options devraient venir d'une API ou d'un enum partagé pour éviter les hardcodes
    rolesOptions = [
        { label: 'Administrateur', value: 'ADMIN' },
        { label: 'Bénévole', value: 'BENEVOLE' },
        { label: 'Manager', value: 'MANAGER' },
    ];

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

    onRowEditSave(user: IUserDto) {
        const original = this.clonedUsers[user.id];

        // Payload partiel typé
        const payload: Partial<IUserPayload> = {};

        // 1. Comparaison champ par champ
        if (user.firstname !== original.firstname) payload.firstname = user.firstname;
        if (user.lastname !== original.lastname) payload.lastname = user.lastname;
        if (user.email !== original.email) payload.email = user.email;
        if (user.phone !== original.phone) payload.phone = user.phone;

        // 2. Gestion Spéciale des Rôles
        const newRole = user.roles?.[0]?.name;
        const oldRole = original.roles?.[0]?.name;

        if (newRole !== oldRole && newRole) {
            payload.roles = newRole;
        }

        // 3. Si aucune modification
        if (Object.keys(payload).length === 0) {
            delete this.clonedUsers[user.id];
            return;
        }

        console.log('Payload Patch envoyé :', payload);

        // 4. Appel au service avec gestion de la souscription
        this.userService
            .patchUser(user.id, payload)
            .pipe(
                // Sécurité : Si le composant est détruit pendant la requête, on annule tout
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: (updatedUser) => {
                    // Ici tu peux ajouter ton toaster de succès
                    console.log('Succès update');
                    delete this.clonedUsers[user.id];
                },
                error: (err) => {
                    console.error('Erreur Update:', err);
                    // Ici tu peux ajouter ton toaster d'erreur
                    this.onRowEditCancel(user, -1);
                },
            });
    }

    onRowEditCancel(user: IUserDto, index: number) {
        this.userService.users()[index] = this.clonedUsers[user.id];
        delete this.clonedUsers[user.id];
    }

    onDelete(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.userService.deleteUser(id).subscribe();
        }
    }
}
