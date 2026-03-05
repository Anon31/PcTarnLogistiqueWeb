import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateur personnalisé pour vérifier l'âge minimum
 * @param minAge L'âge minimum requis (ex: 16)
 */
export function minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null; // Le validateur "required" s'occupe des champs vides

        const today = new Date();
        const birthDate = new Date(control.value);

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        // Si le mois n'est pas encore passé, ou si on est dans le même mois mais que le jour n'est pas passé, on retire 1 an
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Si l'âge est inférieur au minimum, on retourne un objet d'erreur
        return age < minAge ? { minimumAge: { requiredAge: minAge, actualAge: age } } : null;
    };
}
