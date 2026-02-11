import { PageNotFoundComponent } from './page-not-found.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';

describe('PageNotFoundComponent', () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;
    let locationMock: { back: any };

    beforeEach(async () => {
        // Mock du service Location (pour éviter de manipuler l'historique réel du navigateur)
        locationMock = {
            back: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [PageNotFoundComponent],
            providers: [
                // Indispensable pour que le routerLink fonctionne dans le template
                provideRouter([]),
                // Injection du mock Location
                { provide: Location, useValue: locationMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PageNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /**
     * Test de base pour vérifier que le composant est créé sans erreurs
     */
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Test pour vérifier que les éléments de base du message 404 sont présents dans le template
     */
    it('should display the 404 message', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const h1 = compiled.querySelector('h1');
        const h2 = compiled.querySelector('h2');

        expect(h1?.textContent).toContain('404');
        expect(h2?.textContent).toContain('Perdu dans les stocks ?');
    });

    /**
     * Test pour vérifier que la méthode goBack() est appelée lorsque le bouton "Retour" est cliqué
     */
    it('should call location.back() when "Retour" button is clicked', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On cible le bouton qui contient le texte "Retour" (classe btn-ghost)
        const backButton = compiled.querySelector('button.btn-ghost');
        // Simulation du clic
        backButton?.dispatchEvent(new Event('click'));

        // Vérifie que la méthode du service Location a été appelée
        expect(locationMock.back).toHaveBeenCalled();
    });

    /**
     * Test pour vérifier que le lien vers le dashboard est présent et correctement configuré
     */
    it('should have a link to dashboard', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On cible le lien vers le dashboard (classe btn-primary)
        const dashboardLink = compiled.querySelector('a.btn-primary');

        expect(dashboardLink).toBeTruthy();
        expect(dashboardLink?.textContent).toContain('Tableau de bord');
        // Vérification de l'attribut href (généré par routerLink)
        expect(dashboardLink?.getAttribute('href')).toBe('/tableau-de-bord');
    });
});
