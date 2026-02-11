import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [MessageService],
            // NO_ERRORS_SCHEMA est parfait ici :
            // Il permet de tester que la page "Conteneur" s'affiche bien sans avoir
            // à gérer les dépendances complexes de l'enfant <app-form-login> (AuthService, Http, etc.)
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the logo svg', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const logo = compiled.querySelector('svg#logo');
        expect(logo).toBeTruthy();
    });

    it('should display the welcome message', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const h2 = compiled.querySelector('h2');
        const p = compiled.querySelector('p.text-surface-500');

        expect(h2?.textContent).toContain('Bienvenue');
        expect(p?.textContent).toContain("Connectez-vous pour accéder à l'application");
    });

    it('should render the form-login child component', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        // On vérifie juste que la balise est présente dans le HTML
        expect(compiled.querySelector('app-form-login')).toBeTruthy();
    });
});
