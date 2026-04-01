import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { ItemCategory } from '@prisma/client';

describe('ProductsService', () => {
    let service: ProductsService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                providePrismaMock(), // 👈 Injection du Mock Prisma centralisé
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prismaMock = module.get(PrismaService);
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });

    /**
     * TEST DE LA FONCTION CREATE
     */
    describe('create', () => {
        it('doit créer un produit et retourner une ProductEntity', async () => {
            const dto = {
                name: 'Défibrillateur',
                category: ItemCategory.MALAISE,
                minThreshold: 2,
                isPerishable: false,
            };

            prismaMock.product.create.mockResolvedValue({
                id: 1,
                ...dto,
            } as any);

            const result = await service.create(dto as any);

            // Assertions
            expect(prismaMock.product.create).toHaveBeenCalledWith({ data: dto });
            expect(result.name).toEqual('Défibrillateur');
            expect(result.id).toEqual(1);
        });
    });

    /**
     * TEST DE LA FONCTION FIND ALL
     */
    describe('findAll', () => {
        it('doit retourner un tableau de produits', async () => {
            const mockProducts = [
                { id: 1, name: 'Gants' },
                { id: 2, name: 'Pansements' },
            ];

            prismaMock.product.findMany.mockResolvedValue(mockProducts as any);

            const result = await service.findAll();

            expect(prismaMock.product.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result[0].name).toEqual('Gants');
        });
    });

    /**
     * TEST DE LA FONCTION FIND ONE
     */
    describe('findOne', () => {
        it("doit retourner un produit si l'ID existe", async () => {
            const mockProduct = { id: 1, name: 'Gants' };
            prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);

            const result = await service.findOne(1);

            expect(prismaMock.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result.name).toEqual('Gants');
        });

        it("doit lever une NotFoundException si le produit n'existe pas", async () => {
            // On simule que Prisma ne trouve rien (retourne null)
            prismaMock.product.findUnique.mockResolvedValue(null as any);

            // On s'attend à ce que l'appel lève une exception HTTP 404
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    /**
     * TEST DE LA FONCTION UPDATE
     */
    describe('update', () => {
        it("doit mettre à jour le produit si l'ID existe", async () => {
            const mockProduct = { id: 1, name: 'Ancien Nom' };
            const dto = { name: 'Nouveau Nom' };

            // L'update fait d'abord un findOne, il faut donc mocker les deux !
            prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);
            prismaMock.product.update.mockResolvedValue({ ...mockProduct, ...dto } as any);

            const result = await service.update(1, dto);

            expect(prismaMock.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
            expect(result.name).toEqual('Nouveau Nom');
        });
    });

    /**
     * TEST DE LA FONCTION REMOVE
     */
    describe('remove', () => {
        it("doit supprimer le produit si l'ID existe", async () => {
            const mockProduct = { id: 1, name: 'Produit à supprimer' };

            prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);
            prismaMock.product.delete.mockResolvedValue(mockProduct as any);

            const result = await service.remove(1);

            expect(prismaMock.product.findUnique).toHaveBeenCalled();
            expect(prismaMock.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result.id).toEqual(1);
        });

        it("ne doit pas appeler delete si le produit n'existe pas", async () => {
            // Le findUnique initial retourne null
            prismaMock.product.findUnique.mockResolvedValue(null as any);

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);

            // On vérifie que le delete n'a JAMAIS été appelé grâce à l'erreur levée avant
            expect(prismaMock.product.delete).not.toHaveBeenCalled();
        });
    });
});
