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

    it('doit être défini (should be defined)', () => {
        expect(controller).toBeDefined();
    });

    it('doit récupérer la liste des produits via le service', async () => {
        const result = await controller.findAll();

        // On vérifie que le mock a bien fonctionné
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual('Produit de Test');
    });
});
