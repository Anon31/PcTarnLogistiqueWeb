import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { BatchStatus, ItemCategory } from '@prisma/client';

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

    describe('findAllBySite', () => {
        it('doit retourner les produits du site avec la quantite cumulee', async () => {
            prismaMock.product.findMany.mockResolvedValue([
                {
                    id: 2,
                    name: 'Compresse sterile',
                    category: ItemCategory.MALAISE,
                    minThreshold: 10,
                    isPerishable: true,
                    stocks: [{ quantity: 40 }, { quantity: 60 }],
                },
                {
                    id: 1,
                    name: 'Pansement',
                    category: ItemCategory.MALAISE,
                    minThreshold: 5,
                    isPerishable: false,
                    stocks: [{ quantity: 12 }],
                },
            ] as any);

            const result = await service.findAllBySite(1);

            expect(prismaMock.product.findMany).toHaveBeenCalledWith({
                where: {
                    stocks: {
                        some: { siteId: 1 },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    minThreshold: true,
                    isPerishable: true,
                    stocks: {
                        where: { siteId: 1 },
                        select: {
                            quantity: true,
                        },
                    },
                },
                orderBy: { id: 'desc' },
            });
            expect(result).toEqual([
                {
                    id: 2,
                    name: 'Compresse sterile',
                    category: ItemCategory.MALAISE,
                    minThreshold: 10,
                    isPerishable: true,
                    quantity: 100,
                    siteId: 1,
                },
                {
                    id: 1,
                    name: 'Pansement',
                    category: ItemCategory.MALAISE,
                    minThreshold: 5,
                    isPerishable: false,
                    quantity: 12,
                    siteId: 1,
                },
            ]);
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

    describe('findBatchesBySite', () => {
        it('doit retourner tous les lots du produit avec leur quantite sur le site', async () => {
            prismaMock.product.findUnique.mockResolvedValue({
                id: 2,
                name: 'Compresse sterile',
                stocks: [
                    {
                        id: 9,
                        quantity: 40,
                        productBatchNumber: {
                            id: 12,
                            number: 'REF2027',
                            expiryDate: new Date('2025-12-31T00:00:00.000Z'),
                            status: BatchStatus.VALID,
                        },
                    },
                    {
                        id: 7,
                        quantity: 60,
                        productBatchNumber: {
                            id: 11,
                            number: 'REF2026',
                            expiryDate: new Date('2024-12-31T00:00:00.000Z'),
                            status: BatchStatus.VALID,
                        },
                    },
                    {
                        id: 8,
                        quantity: 15,
                        productBatchNumber: {
                            id: 11,
                            number: 'REF2026',
                            expiryDate: new Date('2024-12-31T00:00:00.000Z'),
                            status: BatchStatus.VALID,
                        },
                    },
                ],
            } as any);

            const result = await service.findBatchesBySite(2, 1);

            expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
                where: { id: 2 },
                select: {
                    id: true,
                    name: true,
                    stocks: {
                        where: { siteId: 1 },
                        select: {
                            id: true,
                            quantity: true,
                            productBatchNumber: {
                                select: {
                                    id: true,
                                    number: true,
                                    expiryDate: true,
                                    status: true,
                                },
                            },
                        },
                    },
                },
            });
            expect(result[0]).toEqual({
                id: 2,
                name: 'Compresse sterile',
                number: 'REF2026',
                expiryDate: new Date('2024-12-31T00:00:00.000Z'),
                status: BatchStatus.VALID,
                quantity: 75,
            });
            expect(result[1]).toEqual({
                id: 2,
                name: 'Compresse sterile',
                number: 'REF2027',
                expiryDate: new Date('2025-12-31T00:00:00.000Z'),
                status: BatchStatus.VALID,
                quantity: 40,
            });
        });

        it("doit lever une NotFoundException si le produit n'existe pas", async () => {
            prismaMock.product.findUnique.mockResolvedValue(null as any);

            await expect(service.findBatchesBySite(2, 1)).rejects.toThrow(NotFoundException);
        });

        it('doit retourner un tableau vide si aucun lot n est trouve sur le site', async () => {
            prismaMock.product.findUnique.mockResolvedValue({
                id: 2,
                name: 'Compresse sterile',
                stocks: [{ id: 1, quantity: 100, productBatchNumber: null }],
            } as any);

            await expect(service.findBatchesBySite(2, 1)).resolves.toEqual([]);
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
