import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthService } from '../../../../core/services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarUserComponent } from './sidebar-user.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Pipe, PipeTransform } from '@angular/core';

// On crée un mock pour le test afin d'éviter les erreurs si le vrai Pipe est ailleurs
@Pipe({
    name: 'roleLabel',
    standalone: true,
})
class MockRoleLabelPipe implements PipeTransform {
    transform(value: any): string {
        return 'Role Test (Mock)';
    }
}

describe('SidebarUserComponent', () => {
    let component: SidebarUserComponent;
    let fixture: ComponentFixture<SidebarUserComponent>;
    let authServiceMock: any;

    const mockUser = {
        firstname: 'Thomas',
        lastname: 'Anderson',
        roles: [{ name: 'ADMIN' }],
    };

    beforeEach(async () => {
        // Création du mock pour AuthService avec Vitest
        authServiceMock = {
            userConnected: vi.fn().mockReturnValue(mockUser),
            isAuthenticated: vi.fn().mockReturnValue(true), // On simule qu'il est connecté
            logout: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SidebarUserComponent],
            providers: [
                // On remplace le vrai AuthService par notre mock
                { provide: AuthService, useValue: authServiceMock },
                provideNoopAnimations(),
            ],
        })
            // ASTUCE : On surcharge le composant pour y injecter notre MockPipe
            // Cela permet au test de passer même si le vrai RoleLabelPipe n'est pas importé ici
            .overrideComponent(SidebarUserComponent, {
                add: { imports: [MockRoleLabelPipe] },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Vérifie que les initiales de l'utilisateur sont affichées correctement en prenant la première lettre du prénom et du nom de famille.
     */
    it('should display user initials (First char of firstname + lastname)', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On cible la div qui contient les initiales (classe logo-bg)
        const initialsDiv = compiled.querySelector('.logo-bg');

        // Thomas Anderson => T + A => TA
        expect(initialsDiv?.textContent?.trim()).toBe('TA');
    });

    /**
     * Vérifie que le nom complet de l'utilisateur (prénom + nom) est affiché correctement dans le composant.
     */
    it('should display full user name', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const nameSpan = compiled.querySelector('.user-name');

        expect(nameSpan?.textContent).toContain('Thomas');
        expect(nameSpan?.textContent).toContain('Anderson');
    });

    /**
     * Vérifie que le rôle de l'utilisateur est affiché correctement en utilisant le pipe RoleLabelPipe.
     */
    it('should display the role passed through the pipe', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // Le rôle est dans le span avec la classe opacity-70
        const roleSpan = compiled.querySelector('.opacity-70');
        // On vérifie qu'il affiche ce que notre MockPipe renvoie
        expect(roleSpan?.textContent?.trim()).toBe('Role Test (Mock)');
    });

    /**
     * Vérifie que la méthode de déconnexion est appelée lorsque le bouton de déconnexion est cliqué.
     */
    it('should call logout when button is clicked', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const logoutBtn = compiled.querySelector('p-button');

        // On simule un clic sur le composant bouton
        logoutBtn?.dispatchEvent(new Event('click'));

        expect(authServiceMock.logout).toHaveBeenCalled();
    });
});
