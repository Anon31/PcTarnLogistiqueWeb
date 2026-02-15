import { UserService } from '../../../../core/services/user.service';
import { IUserDto } from '../../../../shared/interfaces/user';
import { Component, inject, OnInit } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgClass } from '@angular/common';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-table-user',
    imports: [Tag, TableModule, InputText, FormsModule, Select, NgClass, Button],
    templateUrl: './table-user.component.html',
    styleUrl: './table-user.component.css',
})
export class TableUserComponent implements OnInit {
    userService = inject(UserService);

    // Pour gérer l'annulation de l'édition (rollback)
    clonedUsers: { [s: string]: IUserDto } = {};

    // Options pour le dropdown de rôles
    rolesOptions = [
        { label: 'Administrateur', value: 'ADMIN' },
        { label: 'Utilisateur', value: 'USER' },
        { label: 'Manager', value: 'MANAGER' },
    ];

    ngOnInit() {
        // Charge les données au montage
        this.userService.getAllUsers();
    }

    // --- LOGIQUE D'ÉDITION ---

    onRowEditInit(user: IUserDto) {
        // Sauvegarde une copie profonde de l'utilisateur avant modif
        this.clonedUsers[user.id] = { ...user };
    }

    onRowEditSave(user: IUserDto) {
        // Appel au service pour sauvegarder
        // Note: Pour les objets imbriqués (address), assure-toi que le backend accepte le partiel
        this.userService.updateUser(user.id, user).subscribe({
            next: () => delete this.clonedUsers[user.id],
            error: () => {
                // En cas d'erreur API, on annule les changements visuels
                this.onRowEditCancel(user, -1); // index -1 car non utilisé ici
            },
        });
    }

    onRowEditCancel(user: IUserDto, index: number) {
        // Restauration des données originales
        // Attention: user est une référence, on doit réassigner les valeurs
        const original = this.clonedUsers[user.id];
        if (original) {
            // On remplace l'objet modifié par l'original dans le tableau source via le service ou directement si possible
            // Ici, comme on est en mode "objet reference", on peut juste copier les props
            Object.assign(user, original);
            delete this.clonedUsers[user.id];
        }
    }

    onDelete(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.userService.deleteUser(id).subscribe();
        }
    }
}
