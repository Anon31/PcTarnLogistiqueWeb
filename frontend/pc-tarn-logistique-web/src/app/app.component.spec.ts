import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Retour à la source stable

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                MessageService,
                provideRouter([]),
                // CORRECTION FINALE : On utilise le provider d'animations standard (eager).
                // C'est la méthode la plus fiable si les variantes async/noop sont dépréciées ou instables.
                provideAnimations(),
            ],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    // On vérifie la structure réelle au lieu du titre
    it('should render the router outlet', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should render the toast component', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('p-toast')).toBeTruthy();
    });
});
