import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SidebarService } from '../../../services/sidebar.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { provideRouter } from '@angular/router';

describe('SidebarMenuComponent', () => {
    let component: SidebarMenuComponent;
    let fixture: ComponentFixture<SidebarMenuComponent>;
    let sidebarServiceMock: { setOpen: any };

    /**
     * Avant chaque test, configure le module de test en import le composant SidebarMenuComponent
     * et en fournissant les dépendances nécessaires et un mock pour le service
     * de sidebar afin de vérifier les interactions avec ce service lors des tests.
     */
    beforeEach(async () => {
        sidebarServiceMock = {
            setOpen: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [SidebarMenuComponent],
            providers: [
                provideRouter([]),
                provideNoopAnimations(),
                // Injection du mock
                { provide: SidebarService, useValue: sidebarServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /**
     * Vérifie que le composant SidebarMenuComponent est créé avec succès.
     */
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Vérifie que les items du menu sont initialisés avec les données correctes.
     */
    it('should initialize menu items with correct data', () => {
        // 🚀 CORRECTION : On exécute le signal en ajoutant () pour récupérer le tableau
        const menuItems = component.items();

        expect(menuItems).toBeDefined();
        expect(menuItems.length).toBe(7);
        expect(menuItems[0].label).toBe('Tableau de bord');
        expect(menuItems[0].icon).toBe('pi pi-th-large');
        expect(menuItems[0].routerLink).toBe('/tableau-de-bord');
    });

    /**
     * Vérifie que le composant rend correctement le menu en utilisant le composant PanelMenu de PrimeNG.
     */
    it('should render the PrimeNG panel menu', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const panelMenu = compiled.querySelector('p-panelmenu');
        expect(panelMenu).toBeTruthy();
    });

    /**
     * Vérifie que lorsque la commande d'un item de menu est déclenchée, le service de sidebar est appelé pour fermer le menu.
     */
    it('should close sidebar when a menu item command is triggered', () => {
        // 🚀 CORRECTION : Lecture de la valeur du Signal ici aussi
        const menuItems = component.items();
        const dashboardItem = menuItems[0];

        expect(dashboardItem?.command).toBeDefined();

        // Simule un clic sur le premier item du menu
        dashboardItem?.command?.({ originalEvent: new MouseEvent('click'), item: dashboardItem });

        // Vérifie que le service de sidebar a été appelé pour fermer le menu
        expect(sidebarServiceMock.setOpen).toHaveBeenCalledWith(false);
    });
});
