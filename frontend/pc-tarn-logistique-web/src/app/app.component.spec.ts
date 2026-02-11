import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                MessageService,
                provideRouter([]),
                // C'est la méthode idéale pour les tests :
                // Elle "bouche" les trous de dépendance pour PrimeNG sans lancer de vraies animations.
                provideNoopAnimations(),
            ],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render the router outlet', () => {
        const fixture = TestBed.createComponent(AppComponent);
        // Force le rendu du HTML (cycle de vie Angular)
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should render the toast component', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        // Vérifie que le composant PrimeNG est bien présent dans le DOM
        expect(compiled.querySelector('p-toast')).toBeTruthy();
    });
});
