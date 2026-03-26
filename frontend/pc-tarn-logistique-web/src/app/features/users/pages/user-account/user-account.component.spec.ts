import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccountComponent } from './user-account.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../services/user.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';

describe('UserAccountComponent', () => {
    let component: UserAccountComponent;
    let fixture: ComponentFixture<UserAccountComponent>;

    // Déclaration de nos fausses dépendances (mocks)
    let mockAuthService: any;
    let mockUserService: any;
    let mockToasterService: any;
    let mockRouter: any;
    let mockDialogService: any;

    beforeEach(async () => {
        // 1. Initialisation des mocks
        mockAuthService = {
            // Simule un utilisateur connecté avec l'ID 1
            userConnected: vi.fn().mockReturnValue({ id: 1 }),
        };

        mockUserService = {
            // Renvoie un faux profil d'utilisateur encapsulé dans un Observable (of)
            getUserById: vi
                .fn()
                .mockReturnValue(of({ id: 1, firstname: 'Thomas', lastname: 'Anderson' })),
            patchUser: vi.fn().mockReturnValue(of({})),
            updateMyPassword: vi.fn().mockReturnValue(of({})),
        };

        mockToasterService = {
            success: vi.fn(), // On intercepte juste l'appel pour éviter les vrais Toasts
        };

        mockRouter = {
            navigate: vi.fn(),
        };

        mockDialogService = {
            // Simule l'ouverture d'une modale et renvoie un objet avec un event onClose
            open: vi.fn().mockReturnValue({
                onClose: of({ currentPassword: 'old', newPassword: 'new' }),
            }),
        };

        await TestBed.configureTestingModule({
            imports: [UserAccountComponent],
            providers: [
                // 2. On remplace les services globaux par nos mocks
                { provide: AuthService, useValue: mockAuthService },
                { provide: UserService, useValue: mockUserService },
                { provide: ToasterService, useValue: mockToasterService },
                { provide: Router, useValue: mockRouter },
            ],
        })
            // 3. DialogService est fourni au niveau du composant (dans son @Component).
            // Il faut donc écraser la définition du composant pour forcer l'utilisation de notre mock.
            .overrideComponent(UserAccountComponent, {
                remove: { providers: [DialogService] },
                add: { providers: [{ provide: DialogService, useValue: mockDialogService }] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(UserAccountComponent);
        component = fixture.componentInstance;

        // 4. Déclenche la détection de changement, ce qui exécute le constructeur et les effects()
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it("devrait charger le profil complet de l'utilisateur au démarrage (via effect)", () => {
        // On vérifie que l'effect() a bien réagi à l'ID de l'utilisateur connecté
        expect(mockUserService.getUserById).toHaveBeenCalledWith(1);

        // On vérifie que le Signal fullUserProfile a bien été mis à jour avec les données du mock
        expect(component.fullUserProfile()?.firstname).toBe('Thomas');
    });

    it('devrait rediriger vers le tableau de bord lors du clic sur annuler', () => {
        component.onCancel();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/tableau-de-bord']);
    });

    it('devrait afficher un succès après la mise à jour du profil', () => {
        component.onUpdateProfile({ firstname: 'Néo' } as any);

        expect(mockUserService.patchUser).toHaveBeenCalledWith(1, { firstname: 'Néo' });
        expect(mockToasterService.success).toHaveBeenCalledWith(
            'Succès',
            'Informations mises à jour.',
        );
    });

    it('devrait ouvrir la modale de mot de passe', () => {
        component.openPasswordDialog();
        expect(mockDialogService.open).toHaveBeenCalled();
    });
});
