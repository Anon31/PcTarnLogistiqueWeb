import { AbstractControl } from '@angular/forms';
import { minimumAgeValidator } from './minimum-age-validator';

describe('minimumAgeValidator', () => {
    // Fonction utilitaire pour simuler un champ de formulaire (AbstractControl)
    const createMockControl = (value: string | null) => {
        return { value } as AbstractControl;
    };

    // 🚀 CORRECTION : Utilitaire pour formater la date en 'YYYY-MM-DD' en heure LOCALE
    // (toISOString() convertit en UTC, ce qui décale souvent le jour à J-1 à cause des fuseaux horaires !)
    const formatDateLocal = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    it('devrait retourner une fonction de validation', () => {
        const validator = minimumAgeValidator(16);
        expect(typeof validator).toBe('function');
    });

    it('devrait retourner null si le champ est vide (géré par Validators.required)', () => {
        const validator = minimumAgeValidator(16);
        expect(validator(createMockControl(null))).toBeNull();
        expect(validator(createMockControl(''))).toBeNull();
    });

    it("devrait retourner null si l'utilisateur a exactement l'âge requis", () => {
        const minAge = 16;
        const validator = minimumAgeValidator(minAge);

        // On calcule la date d'il y a exactement 16 ans
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
        // Utilisation de la nouvelle fonction locale
        const formattedDate = formatDateLocal(birthDate);

        expect(validator(createMockControl(formattedDate))).toBeNull();
    });

    it("devrait retourner null si l'utilisateur est plus vieux que l'âge requis", () => {
        const minAge = 16;
        const validator = minimumAgeValidator(minAge);

        const today = new Date();
        const birthDate = new Date(
            today.getFullYear() - (minAge + 10),
            today.getMonth(),
            today.getDate(),
        );
        const formattedDate = formatDateLocal(birthDate);

        expect(validator(createMockControl(formattedDate))).toBeNull();
    });

    it("devrait retourner un objet d'erreur si l'utilisateur est trop jeune", () => {
        const minAge = 18;
        const validator = minimumAgeValidator(minAge);

        const today = new Date();
        // On simule quelqu'un qui a 2 ans de moins que l'âge requis
        const birthDate = new Date(
            today.getFullYear() - (minAge - 2),
            today.getMonth(),
            today.getDate(),
        );
        const formattedDate = formatDateLocal(birthDate);

        const result = validator(createMockControl(formattedDate));

        expect(result).not.toBeNull();
        expect(result?.['minimumAge']).toBeDefined();
        expect(result?.['minimumAge'].requiredAge).toBe(18);
        expect(result?.['minimumAge'].actualAge).toBe(16);
    });

    it("devrait retourner une erreur si l'utilisateur aura l'âge requis seulement DEMAIN (Edge Case)", () => {
        const minAge = 18;
        const validator = minimumAgeValidator(minAge);

        const today = new Date();
        // Naissance il y a 18 ans, MAIS demain (+1 jour)
        const birthDate = new Date(
            today.getFullYear() - minAge,
            today.getMonth(),
            today.getDate() + 1,
        );
        const formattedDate = formatDateLocal(birthDate);

        const result = validator(createMockControl(formattedDate));

        // Il a toujours 17 ans aujourd'hui !
        expect(result).not.toBeNull();
        expect(result?.['minimumAge'].actualAge).toBe(17);
    });
});
