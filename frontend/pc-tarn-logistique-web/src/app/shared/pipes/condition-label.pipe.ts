import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'conditionLabel',
})
export class ConditionLabelPipe implements PipeTransform {
    transform(value: string | undefined | null): string {
        if (!value) return '';

        // Normalisation pour gérer les majuscules/minuscules
        const state = value.toUpperCase();

        switch (state) {
            case 'BON':
                return 'Bon';
            case 'MOYEN':
                return 'Moyen';
            case 'A_CHANGER':
                return 'À changer';
            case 'HS':
                return 'Hors service';
            default:
                // Si l'état n'est pas connu, on l'affiche tel quel avec la première lettre en maj
                return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    }
}
