import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '../../../../core/services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarUserComponent } from './sidebar-user.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;
    let authServiceMock: any;

    const mockUser = {
        firstname: 'Thomas',
        lastname: 'Anderson',
        // On enrichit le mock pour couvrir toutes les manières dont le HTML pourrait appeler la donnée
        role: 'ADMIN',
        roles: ['ADMIN', { name: 'ADMIN' }],
    };

    beforeEach(async () => {
        // Création du mock pour AuthService avec Vitest
        authServiceMock = {
            userConnected: vi.fn().mockReturnValue(mockUser),
            isAuthenticated: vi.fn().mockReturnValue(true), // On simule qu'il est connecté
            logout: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SidebarUserComponent], // Le vrai RoleLabelPipe est déjà importé à l'intérieur de SidebarUserComponent !
            providers: [
                // On remplace le vrai AuthService par notre mock
                { provide: AuthService, useValue: authServiceMock },
                provideNoopAnimations(),
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Vérifie que les initiales de l'utilisateur sont affichées correctement en prenant la première lettre du prénom et du nom de famille.
     */
    it("devrait afficher les initiales de l'utilisateur (Première lettre du prénom + nom)", () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const initialsDiv = compiled.querySelector('.logo-bg');

        expect(initialsDiv?.textContent?.trim()).toBe('TA');
    });

    /**
     * Vérifie que le nom complet de l'utilisateur (prénom + nom) est affiché correctement dans le composant.
     */
    it("devrait afficher le nom complet de l'utilisateur", () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const nameSpan = compiled.querySelector('.user-name');

        expect(nameSpan?.textContent).toContain('Thomas');
        expect(nameSpan?.textContent).toContain('Anderson');
    });

    /**
     * Vérifie que le rôle de l'utilisateur est affiché correctement en utilisant le vrai RoleLabelPipe.
     */
    it('devrait afficher le rôle formaté via le vrai pipe', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const roleSpan = compiled.querySelector('.opacity-70');

        expect(roleSpan?.textContent?.trim()).toBe('Administrateur');
    });
});
