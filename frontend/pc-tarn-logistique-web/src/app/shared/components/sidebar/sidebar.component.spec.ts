import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { provideRouter } from '@angular/router';
// IMPORT DES VRAIS ENFANTS (Pour les retirer)
import { SidebarUserComponent } from './sidebar-user/sidebar-user.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarService } from '../../../core/services/sidebar.service';

// --- DEFINITION DES MOCKS ---
// Ces composants remplacent les vrais pour le test.
// Ils sont vides et n'ont aucune dépendance, ce qui évite toutes les erreurs.
@Component({
    selector: 'app-sidebar-header',
    template: '<div>Mock Header</div>',
    standalone: true,
})
class MockSidebarHeaderComponent {}

@Component({
    selector: 'app-sidebar-menu',
    template: '<div>Mock Menu</div>',
    standalone: true,
})
class MockSidebarMenuComponent {}

@Component({
    selector: 'app-sidebar-user',
    template: '<div>Mock User</div>',
    standalone: true,
})
class MockSidebarUserComponent {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let sidebarServiceMock: any;

    beforeEach(async () => {
        // Mock du Service
        sidebarServiceMock = {
            isOpen: vi.fn().mockReturnValue(false),
            setOpen: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SidebarComponent],
            providers: [
                provideRouter([]),
                provideNoopAnimations(),
                { provide: SidebarService, useValue: sidebarServiceMock },
            ],
            // NO_ERRORS_SCHEMA pour d'autres éléments (comme p-drawer s'il manque)
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(SidebarComponent, {
                // ÉCHANGE STANDARD : On enlève les vrais, on met les faux.
                remove: {
                    imports: [SidebarUserComponent, SidebarMenuComponent, SidebarHeaderComponent],
                },
                add: {
                    imports: [
                        MockSidebarHeaderComponent,
                        MockSidebarMenuComponent,
                        MockSidebarUserComponent,
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;

        // Initialisation de la version pour le test
        component.appVersion = '1.0.0-test';

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Vérifie que les éléments principaux sont présents (aside, drawer, version).
     * Vérifie que les classes CSS sont appliquées correctement.
     */
    it('should render the desktop aside', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const aside = compiled.querySelector('aside');

        expect(aside).toBeTruthy();
        expect(aside?.classList.contains('layout-sidebar')).toBe(true);
    });

    /**
     * Vérifie que le composant de drawer est présent pour les tablettes.
     */
    it('should render the tablette drawer', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const drawer = compiled.querySelector('p-drawer');
        expect(drawer).toBeTruthy();
    });

    /**
     * Vérifie que lorsque le drawer se cache, la méthode du service est appelée pour mettre à jour l'état d'ouverture.
     */
    it('should call service.setOpen(false) when drawer hides', () => {
        // On teste directement la méthode du composant
        component.onDrawerHide();

        expect(sidebarServiceMock.setOpen).toHaveBeenCalledWith(false);
    });

    /**
     * Vérifie que la version de l'application est affichée dans un badge.
     */
    it('should display the app version', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const badge = compiled.querySelector('.version-badge');

        expect(badge).toBeTruthy();
        expect(badge?.textContent).toContain('v1.0.0-test');
    });
});
