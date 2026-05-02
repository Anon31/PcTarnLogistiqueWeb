import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
    let controller: ProductsController;

    beforeEach(async () => {
        // Initialisation du module de test avec les dépendances nécessaires
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                // Nous injectons UNIQUEMENT le service métier en le mockant.
                // PrismaService a été retiré car le contrôleur n'en a pas l'utilité directe !
                {
                    provide: ProductsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Produit de Test' }]),
                        findAllBySite: jest.fn().mockResolvedValue([{ id: 1, name: 'Produit de Test', quantity: 3 }]),
                        findBatchesBySite: jest.fn().mockResolvedValue([
                            {
                                id: 2,
                                name: 'Compresse sterile',
                                number: 'REF2026',
                                expiryDate: '2024-12-31',
                                status: 'VALID',
                                quantity: 60,
                            },
                            {
                                id: 2,
                                name: 'Compresse sterile',
                                number: 'REF2027',
                                expiryDate: '2025-12-31',
                                status: 'VALID',
                                quantity: 40,
                            },
                        ]),
                        findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Produit de Test' }),
                        create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 2, ...dto })),
                        update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
                        remove: jest.fn().mockResolvedValue({ id: 1, name: 'Produit supprimé' }),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });

    it('doit récupérer la liste des produits via le service', async () => {
        const result = await controller.findAll();

        // On vérifie que le mock a bien fonctionné
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual('Produit de Test');
    });
    it('doit recuperer tous les lots du produit pour un site donne', async () => {
        const result = await controller.findBatchesBySite(2, { siteId: 1 });

        expect(result).toHaveLength(2);
        expect(result[0].number).toEqual('REF2026');
        expect(result[1].quantity).toEqual(40);
    });
});
