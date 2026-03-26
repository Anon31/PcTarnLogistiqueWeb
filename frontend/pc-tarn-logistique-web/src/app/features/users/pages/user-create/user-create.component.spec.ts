import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateComponent } from './user-create.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserCreateComponent', () => {
    let component: UserCreateComponent;
    let fixture: ComponentFixture<UserCreateComponent>;

    let mockUserService: any;
    let mockToasterService: any;
    let mockRouter: any;

    beforeEach(async () => {
        // 1. Initialisation des mocks
        mockUserService = {
            // Simule un retour d'API réussi pour la création
            createUser: vi.fn().mockReturnValue(of({ firstname: 'Thomas', lastname: 'Anderson' })),
        };

        mockToasterService = {
            success: vi.fn(),
        };

        mockRouter = {
            // Pour le routeur, navigate renvoie une Promesse, on la simule
            navigate: vi.fn().mockResolvedValue(true),
        };

        await TestBed.configureTestingModule({
            imports: [UserCreateComponent],
            providers: [
                // 2. Remplacement par nos fausses dépendances
                { provide: UserService, useValue: mockUserService },
                { provide: ToasterService, useValue: mockToasterService },
                { provide: Router, useValue: mockRouter },
                // On fournit les animations au cas où les sous-composants (PageCardWrapper/FormUser) utilisent PrimeNG
                provideNoopAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('devrait rediriger vers la liste des utilisateurs lors du clic sur annuler', () => {
        component.onCancel();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/utilisateurs/rechercher']);
    });

    it("devrait appeler l'API, rediriger, puis afficher un toaster de succès lors de la création", async () => {
        const fakePayload = { firstname: 'Thomas', lastname: 'Anderson' } as any;

        // Déclenchement de la méthode de création
        component.onCreate(fakePayload);

        // Vérifie que l'appel API a bien été lancé
        expect(mockUserService.createUser).toHaveBeenCalledWith(fakePayload);

        // Puisque le routeur utilise une Promesse (.then()), on attend qu'elle se résolve
        await fixture.whenStable();

        // Vérifie que la redirection a bien été lancée
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/utilisateurs/rechercher']);

        // Vérifie que le toaster affiche le bon message après la redirection
        expect(mockToasterService.success).toHaveBeenCalledWith(
            'Succès',
            'Thomas a été ajouté avec succès.',
        );
    });
});
