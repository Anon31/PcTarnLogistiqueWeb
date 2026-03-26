import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditingComponent } from './user-editing.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UserEditingComponent', () => {
    let component: UserEditingComponent;
    let fixture: ComponentFixture<UserEditingComponent>;

    let mockUserService: any;
    let mockToasterService: any;
    let mockRouter: any;

    beforeEach(async () => {
        // 1. Initialisation des mocks
        mockUserService = {
            getUserById: vi
                .fn()
                .mockReturnValue(of({ id: 42, firstname: 'Thomas', lastname: 'Anderson' })),
            patchUser: vi.fn().mockReturnValue(of({})),
        };

        mockToasterService = {
            success: vi.fn(),
        };

        mockRouter = {
            navigate: vi.fn().mockResolvedValue(true),
        };

        await TestBed.configureTestingModule({
            imports: [UserEditingComponent],
            providers: [
                // 2. Remplacement par nos fausses dépendances
                { provide: UserService, useValue: mockUserService },
                { provide: ToasterService, useValue: mockToasterService },
                { provide: Router, useValue: mockRouter },
                // On fournit les animations pour les sous-composants PrimeNG
                provideNoopAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserEditingComponent);
        component = fixture.componentInstance;

        // Note : On ne fait pas le fixture.detectChanges() immédiatement ici
        // car on veut d'abord pouvoir configurer le Signal Input dans nos tests.
    });

    it('devrait créer le composant', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("devrait charger les données de l'utilisateur via effect() quand l'ID est fourni", async () => {
        // 💡 Astuce Angular 17+ : On injecte la valeur dans l'input() Signal via componentRef
        fixture.componentRef.setInput('id', '42');

        // On déclenche la détection pour lancer l'effect()
        fixture.detectChanges();
        await fixture.whenStable();

        expect(mockUserService.getUserById).toHaveBeenCalledWith(42);
        expect(component.loadedUser()?.firstname).toBe('Thomas');
    });

    it("devrait rediriger vers la liste si l'utilisateur n'existe pas (Erreur API)", async () => {
        // On simule une erreur 404 lors de la récupération
        mockUserService.getUserById = vi
            .fn()
            .mockReturnValue(throwError(() => new Error('Utilisateur introuvable')));

        fixture.componentRef.setInput('id', '999');
        fixture.detectChanges();
        await fixture.whenStable();

        // On vérifie que la redirection (gestion d'erreur) a bien eu lieu
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/utilisateurs/rechercher']);
    });

    it('devrait appeler le patch, rediriger et afficher un succès lors de la mise à jour', async () => {
        // On instancie l'utilisateur en mémoire
        fixture.componentRef.setInput('id', '42');
        fixture.detectChanges();
        await fixture.whenStable();

        const fakeUpdatePayload = { firstname: 'Neo' } as any;

        // Déclenchement de la méthode de mise à jour
        component.onUpdate(fakeUpdatePayload);

        // Vérifie l'appel au service avec l'ID (42) et le payload
        expect(mockUserService.patchUser).toHaveBeenCalledWith(42, fakeUpdatePayload);

        // On attend la résolution de la promesse du routeur (.then())
        await fixture.whenStable();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/utilisateurs/rechercher']);
        expect(mockToasterService.success).toHaveBeenCalledWith(
            'Mise à jour réussie',
            'Les informations ont été modifiées.',
        );
    });

    it('devrait rediriger vers la liste lors du clic sur annuler', () => {
        fixture.detectChanges();
        component.onCancel();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/utilisateurs/rechercher']);
    });
});
