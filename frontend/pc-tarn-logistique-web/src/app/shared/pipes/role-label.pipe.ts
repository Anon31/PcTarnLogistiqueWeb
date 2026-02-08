import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roleLabel',
})
export class RoleLabelPipe implements PipeTransform {
    transform(value: string | undefined | null): string {
        if (!value) return '';

        // Normalisation pour gérer les majuscules/minuscules
        const role = value.toUpperCase();

        switch (role) {
            case 'ADMIN':
                return 'Administrateur';
            case 'MANAGER':
                return 'Responsable';
            case 'BENEVOLE':
                return 'Bénévole';
            default:
                // Si le rôle n'est pas connu, on l'affiche tel quel avec la première lettre en maj
                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    }
}
