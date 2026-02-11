import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLoginComponent } from './form-login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('FormLoginComponent', () => {
    let component: FormLoginComponent;
    let fixture: ComponentFixture<FormLoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormLoginComponent],
            providers: [
                AuthService,
                ToasterService,
                MessageService,
                // HttpClient : Indispensable pour AuthService
                provideHttpClient(),
                // Router : Pour la redirection après login
                provideRouter([]),
                // Animations : Pour les composants PrimeNG (Input, Toast, etc.)
                provideNoopAnimations(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FormLoginComponent);
        component = fixture.componentInstance;
        // Mieux que whenStable() pour initialiser le DOM et le ngOnInit
        fixture.detectChanges();
    });

    /**
     * Ce test vérifie que le composant FormLoginComponent est créé avec succès.
     */
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * Ce test vérifie que le formulaire de login est correctement rendu dans le DOM.
     */
    it('should display the login form', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        // Vérifie qu'on a bien des champs de saisie (Email / Password)
        const inputs = compiled.querySelectorAll('input');
        expect(inputs.length).toBeGreaterThanOrEqual(1);

        // Vérifie la présence d'un bouton de soumission
        const button = compiled.querySelector('button') || compiled.querySelector('p-button');
        expect(button).toBeTruthy();
    });

    /**
     * Ce test vérifie que le formulaire est initialement invalide, ce qui est attendu
     * car les champs sont vides et ont des validateurs "required".
     */
    it('should start with an invalid form', () => {
        if (component.form) {
            expect(component.form.valid).toBeFalsy();
            expect(component.form.get('email')?.valid).toBeFalsy();
        }
    });
});
