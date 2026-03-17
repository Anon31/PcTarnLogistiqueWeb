import { SidebarHeaderComponent } from './sidebar-header.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

describe('SidebarHeaderComponent', () => {
    let component: SidebarHeaderComponent;
    let fixture: ComponentFixture<SidebarHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarHeaderComponent],
            providers: [
                // Même s'il n'y a pas de lien actuellement, c'est une bonne pratique
                // de laisser le router pour un header (souvent cliquable vers l'accueil).
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Ce test vérifie que le logo SVG est présent dans le DOM du composant SidebarHeaderComponent.
     */
    it('should display the logo svg', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const logo = compiled.querySelector('svg#logo');
        expect(logo).toBeTruthy();
    });

    /**
     * Ce test vérifie que le nom de l'organisation "Protection Civile" est affiché dans le DOM du composant SidebarHeaderComponent.
     */
    it('should display the organization name', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On cible le span qui contient le texte "Protection Civile" via ses classes
        const title = compiled.querySelector('.font-bold.text-lg');

        expect(title).toBeTruthy();
        expect(title?.textContent).toContain('Protection Civile');
    });

    /**
     * Ce test vérifie que la localisation "Tarn" est affichée dans le DOM du composant SidebarHeaderComponent.
     */
    it('should display the location "Tarn"', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On cible le sous-titre
        const subtitle = compiled.querySelector('.text-xs.opacity-70');

        expect(subtitle).toBeTruthy();
        expect(subtitle?.textContent?.trim()).toMatch(/Tarn/i);
    });
});
