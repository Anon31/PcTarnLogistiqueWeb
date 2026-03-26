import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormPasswordComponent } from './form-password.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FormPasswordComponent', () => {
    let component: FormPasswordComponent;
    let fixture: ComponentFixture<FormPasswordComponent>;
    let mockDialogRef: any;

    beforeEach(async () => {
        // On simule la référence de la modale PrimeNG pour pouvoir vérifier si "close" est appelé
        mockDialogRef = {
            close: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [FormPasswordComponent],
            providers: [
                { provide: DynamicDialogRef, useValue: mockDialogRef },
                provideNoopAnimations(), // Important pour les composants PrimeNG (Password, etc.)
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FormPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('devrait initialiser le formulaire comme invalide avec les champs vides', () => {
        expect(component.passwordForm.invalid).toBeTruthy();
        expect(component.passwordForm.get('currentPassword')?.value).toBe('');
        expect(component.passwordForm.get('newPassword')?.value).toBe('');
    });

    it("devrait invalider le champ newPassword s'il fait moins de 8 caractères", () => {
        const newPasswordCtrl = component.passwordForm.get('newPassword');

        // Test avec une longueur insuffisante (7 caractères)
        newPasswordCtrl?.setValue('1234567');
        expect(newPasswordCtrl?.invalid).toBeTruthy();
        expect(newPasswordCtrl?.errors?.['minlength']).toBeTruthy();

        // Test avec la longueur requise (8 caractères)
        newPasswordCtrl?.setValue('12345678');
        expect(newPasswordCtrl?.valid).toBeTruthy();
    });

    it('devrait marquer le formulaire comme touché et NE PAS fermer la modale si les données sont invalides lors de la soumission', () => {
        // On soumet un formulaire vide (invalide)
        component.onSubmit();

        // Les champs doivent être marqués comme touchés pour afficher les erreurs en rouge à l'écran
        expect(component.passwordForm.touched).toBeTruthy();
        // La modale ne doit pas se fermer
        expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('devrait fermer la modale en renvoyant le formulaire si la soumission est valide', () => {
        // On remplit le formulaire avec des données valides
        component.passwordForm.patchValue({
            currentPassword: 'monAncienMotDePasse',
            newPassword: 'monNouveauMotDePasse8!',
        });

        component.onSubmit();

        // La modale doit se fermer et renvoyer l'objet "RawValue" du formulaire
        expect(mockDialogRef.close).toHaveBeenCalledWith({
            currentPassword: 'monAncienMotDePasse',
            newPassword: 'monNouveauMotDePasse8!',
        });
    });

    it('devrait fermer la modale SANS données lors du clic sur le bouton Annuler', () => {
        component.onCancel();

        // L'appel à "close" sans argument annule l'opération pour le parent
        expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
});
