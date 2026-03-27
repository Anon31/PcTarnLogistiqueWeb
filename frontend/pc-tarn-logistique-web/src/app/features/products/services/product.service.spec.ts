import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { IProductDto, IProductPayload } from '../models/product.model';
import { environment } from '../../../../environments/environment';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.API_URL}/products`;

    // Données de test
    const mockProducts: IProductDto[] = [
        { id: 1, name: 'Produit A', category: 'CAT1', minThreshold: 5, isPerishable: true },
        { id: 2, name: 'Produit B', category: 'CAT2', minThreshold: 10, isPerishable: false },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifie qu'il n'y a pas de requêtes HTTP non traitées
        httpMock.verify();
    });

    it('devrait être créé', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllProducts', () => {
        it('devrait charger les produits et mettre à jour le signal products', () => {
            service.getAllProducts();

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('GET');

            // On simule la réponse du serveur
            req.flush(mockProducts);

            // On vérifie que le signal a bien été mis à jour
            expect(service.products()).toEqual(mockProducts);
            expect(service.products().length).toBe(2);
        });
    });

    describe('patchProduct', () => {
        it('devrait envoyer une requête PATCH et mettre à jour le produit localement (optimisme)', () => {
            // Initialisation de l'état local
            service['productsSignal'].set([...mockProducts]);

            const updatedInfo: Partial<IProductPayload> = { name: 'Produit A Modifié' };
            const updatedProduct: IProductDto = { ...mockProducts[0], name: 'Produit A Modifié' };

            service.patchProduct(1, updatedInfo).subscribe((res) => {
                expect(res).toEqual(updatedProduct);
            });

            const req = httpMock.expectOne(`${apiUrl}/1`);
            expect(req.request.method).toBe('PATCH');
            req.flush(updatedProduct);

            // Vérification de la mise à jour du Signal
            const productInSignal = service.products().find((p) => p.id === 1);
            expect(productInSignal?.name).toBe('Produit A Modifié');
        });
    });

    describe('deleteProduct', () => {
        it('devrait envoyer une requête DELETE et retirer le produit du signal', () => {
            service['productsSignal'].set([...mockProducts]);

            service.deleteProduct(1).subscribe();

            const req = httpMock.expectOne(`${apiUrl}/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush({});

            // Vérification que l'ID 1 n'existe plus dans le Signal
            expect(service.products().length).toBe(1);
            expect(service.products().find((p) => p.id === 1)).toBeUndefined();
        });
    });

    describe('rollbackProduct', () => {
        it("devrait restaurer un produit à un index spécifique (gestion d'erreur)", () => {
            service['productsSignal'].set([...mockProducts]);
            const originalProduct = { ...mockProducts[0] };

            // Simulation d'une modification locale "sale"
            service['productsSignal'].update((list) => {
                list[0].name = 'MAUVAISE DONNEE';
                return [...list];
            });

            // Action de rollback
            service.rollbackProduct(0, originalProduct);

            // Vérification
            expect(service.products()[0].name).toBe('Produit A');
        });
    });
});
