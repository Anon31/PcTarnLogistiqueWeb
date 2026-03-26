import { RoleLabelPipe } from './role-label.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

describe('RoleLabelPipe', () => {
    let pipe: RoleLabelPipe;

    beforeEach(() => {
        // Un pipe est une simple classe, pas besoin de TestBed compliqué !
        pipe = new RoleLabelPipe();
    });

    it('devrait créer une instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('devrait retourner une chaîne vide pour une valeur null, undefined ou vide', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
        expect(pipe.transform('')).toBe('');
    });

    it('devrait transformer "ADMIN" (et ses variations) en "Administrateur"', () => {
        expect(pipe.transform('ADMIN')).toBe('Administrateur');
        expect(pipe.transform('admin')).toBe('Administrateur'); // Vérifie la normalisation
        expect(pipe.transform('AdMiN')).toBe('Administrateur');
    });

    it('devrait transformer "MANAGER" (et ses variations) en "Responsable"', () => {
        expect(pipe.transform('MANAGER')).toBe('Responsable');
        expect(pipe.transform('manager')).toBe('Responsable');
    });

    it('devrait transformer "BENEVOLE" (et ses variations) en "Bénévole"', () => {
        expect(pipe.transform('BENEVOLE')).toBe('Bénévole');
        expect(pipe.transform('benevole')).toBe('Bénévole');
    });

    it('devrait mettre une majuscule aux rôles inconnus et les formater correctement', () => {
        // Si on lui passe 'visiteur', il doit renvoyer 'Visiteur'
        expect(pipe.transform('visiteur')).toBe('Visiteur');

        // S'il reçoit un mot tout en majuscules non reconnu, il garde la 1ère majuscule et met le reste en minuscules
        expect(pipe.transform('CHAUFFEUR')).toBe('Chauffeur');
    });
});
