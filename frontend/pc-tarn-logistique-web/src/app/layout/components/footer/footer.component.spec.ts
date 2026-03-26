import { SystemService } from '../../../core/services/system.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FooterComponent } from './footer.component';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let mockSystemService: any;

    beforeEach(async () => {
        // 1. Mock du service : on simule la réponse de getSystemStatus en respectant l'interface
        mockSystemService = {
            getSystemStatus: vi.fn().mockReturnValue(
                of({
                    environment: 'STAGING',
                    vaultSecured: true,
                    version: '1.2.0',
                    timestamp: '2026-03-26T12:00:00Z',
                }),
            ),
        };

        await TestBed.configureTestingModule({
            imports: [FooterComponent],
            providers: [provideRouter([]), { provide: SystemService, useValue: mockSystemService }],
        }).compileComponents();

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;

        // 2. Le detectChanges va lancer "toSignal", qui va souscrire à notre mockSystemService
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it("devrait récupérer le statut du système à l'initialisation (via toSignal)", () => {
        expect(mockSystemService.getSystemStatus).toHaveBeenCalled();

        // On vérifie les vraies propriétés de l'interface SystemStatus
        const currentStatus = component.status();
        expect(currentStatus?.environment).toBe('STAGING');
        expect(currentStatus?.vaultSecured).toBe(true);
        expect(currentStatus?.version).toBe('1.2.0');
    });

    it('devrait mettre à jour le signal isOnline à true quand la connexion revient (@HostListener window:online)', () => {
        // On simule manuellement que l'application était déconnectée
        component.isOnline.set(false);

        // On simule l'événement système global
        window.dispatchEvent(new Event('online'));

        expect(component.isOnline()).toBeTruthy();
    });

    it('devrait mettre à jour le signal isOnline à false quand la connexion est perdue (@HostListener window:offline)', () => {
        // On s'assure que le composant est en ligne
        component.isOnline.set(true);

        // On simule une coupure réseau locale
        window.dispatchEvent(new Event('offline'));

        expect(component.isOnline()).toBeFalsy();
    });
});
