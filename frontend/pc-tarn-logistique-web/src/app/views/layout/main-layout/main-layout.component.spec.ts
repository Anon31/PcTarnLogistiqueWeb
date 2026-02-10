import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { provideRouter } from '@angular/router';

describe('MainLayoutComponent', () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainLayoutComponent], // Source: Standalone[_MainLayoutComponent].
            providers: [
                // Corrige l'erreur NG0201: No provider found for `ActivatedRoute`.
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;

        // detectChanges() est souvent préférable à whenStable() pour l'initialisation
        // car il déclenche ngOnInit et les bindings initiaux
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
