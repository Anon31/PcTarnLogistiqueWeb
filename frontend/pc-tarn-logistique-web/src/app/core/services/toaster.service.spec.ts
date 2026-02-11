import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ToasterService } from './toaster.service';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

describe('ToasterService', () => {
    let service: ToasterService;
    // Typage du mock pour TypeScript
    let messageServiceMock: { add: any };

    beforeEach(() => {
        // Création du mock pour MessageService
        messageServiceMock = {
            add: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                ToasterService,
                // Le vrai MessageService est remplacé par le mock
                { provide: MessageService, useValue: messageServiceMock },
            ],
        });
        service = TestBed.inject(ToasterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /**
     * Test pour la méthode success du ToasterService.
     */
    it('should call messageService.add with "success" severity', () => {
        const summary = 'Succès';
        const detail = 'Opération réussie';

        service.success(summary, detail);

        // Vérifie que messageService.add a été appelé avec les bons paramètres
        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'success',
            summary,
            detail,
        });
    });

    /**
     * Test pour la méthode error du ToasterService.
     */
    it('should call messageService.add with "error" severity', () => {
        const summary = 'Erreur';
        const detail = 'Une erreur est survenue';

        service.error(summary, detail);

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary,
            detail,
        });
    });

    /**
     * Test pour la méthode info du ToasterService.
     */
    it('should call messageService.add with "info" severity', () => {
        const summary = 'Info';
        const detail = 'Information importante';

        service.info(summary, detail);

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'info',
            summary,
            detail,
        });
    });

    /**
     * Test pour la méthode warn du ToasterService.
     */
    it('should call messageService.add with "warn" severity', () => {
        const summary = 'Attention';
        const detail = 'Veuillez vérifier vos données';

        service.warn(summary, detail);

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'warn',
            summary,
            detail,
        });
    });
});
