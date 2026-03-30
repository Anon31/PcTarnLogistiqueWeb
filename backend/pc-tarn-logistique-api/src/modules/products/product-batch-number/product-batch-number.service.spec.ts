import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BatchStatus, Condition, ItemCategory, SiteType, TypeMovement } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../../mocks/prisma-mock';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProductBatchNumberService } from './product-batch-number.service';

describe('ProductBatchNumberService', () => {
    let service: ProductBatchNumberService;
    let prismaMock: MockPrismaService;

    const mockProductBatchNumber = {
        id: 1,
        number: 'LOT-COMP-2027-01',
        expiryDate: new Date('2027-01-31T00:00:00.000Z'),
        status: BatchStatus.VALID,
        stocks: [
            {
                id: 1,
                quantity: 100,
                condition: Condition.BON,
                productId: 1,
                siteId: 1,
                ProductBatchNumberId: 1,
                product: {
                    id: 1,
                    name: 'Compresses Steriles 10x10',
                    category: ItemCategory.PLAIE,
                    minThreshold: 20,
                    isPerishable: true,
                },
                site: {
                    id: 1,
                    name: "Antenne d'Albi",
                    type: SiteType.INDOOR,
                    code: 'ALB',
                },
            },
        ],
        stockMovements: [
            {
                id: 1,
                type: TypeMovement.INPUT,
                createdAt: new Date('2026-03-29T10:00:00.000Z'),
                quantity: 100,
                userId: 1,
                productBatchNumberId: 1,
                siteId: 1,
                productId: 1,
                product: {
                    id: 1,
                    name: 'Compresses Steriles 10x10',
                    category: ItemCategory.PLAIE,
                    minThreshold: 20,
                    isPerishable: true,
                },
                site: {
                    id: 1,
                    name: "Antenne d'Albi",
                    type: SiteType.INDOOR,
                    code: 'ALB',
                },
            },
        ],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductBatchNumberService, providePrismaMock()],
        }).compile();

        service = module.get<ProductBatchNumberService>(ProductBatchNumberService);
        prismaMock = module.get(PrismaService) as unknown as MockPrismaService;
    });

    it('doit etre defini', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit creer un lot de fabrication produit', async () => {
            const dto = {
                number: 'LOT-COMP-2027-01',
                expiryDate: new Date('2027-01-31T00:00:00.000Z'),
                status: BatchStatus.VALID,
            };

            prismaMock.productBatchNumber.create.mockResolvedValue(mockProductBatchNumber as any);

            const result = await service.create(dto);

            expect(prismaMock.productBatchNumber.create).toHaveBeenCalledWith({
                data: dto,
                include: {
                    stocks: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                    stockMovements: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.id).toEqual(1);
            expect(result.number).toEqual('LOT-COMP-2027-01');
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les lots de fabrication avec leurs relations', async () => {
            prismaMock.productBatchNumber.findMany.mockResolvedValue([mockProductBatchNumber] as any);

            const result = await service.findAll();

            expect(prismaMock.productBatchNumber.findMany).toHaveBeenCalledWith({
                include: {
                    stocks: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                    stockMovements: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(1);
            expect(result[0].stocks?.[0].quantity).toEqual(100);
        });
    });

    describe('findOne', () => {
        it("doit retourner un lot de fabrication si l'ID existe", async () => {
            prismaMock.productBatchNumber.findUnique.mockResolvedValue(mockProductBatchNumber as any);

            const result = await service.findOne(1);

            expect(prismaMock.productBatchNumber.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    stocks: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                    stockMovements: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.status).toEqual(BatchStatus.VALID);
        });

        it("doit lever une NotFoundException si le lot n'existe pas", async () => {
            prismaMock.productBatchNumber.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('doit mettre a jour un lot de fabrication', async () => {
            prismaMock.productBatchNumber.findUnique.mockResolvedValue(mockProductBatchNumber as any);
            prismaMock.productBatchNumber.update.mockResolvedValue({
                ...mockProductBatchNumber,
                status: BatchStatus.QUARANTINE,
            } as any);

            const dto = {
                status: BatchStatus.QUARANTINE,
            };

            const result = await service.update(1, dto);

            expect(prismaMock.productBatchNumber.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dto,
                include: {
                    stocks: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                    stockMovements: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.status).toEqual(BatchStatus.QUARANTINE);
        });
    });

    describe('remove', () => {
        it("doit supprimer un lot de fabrication si l'ID existe", async () => {
            prismaMock.productBatchNumber.findUnique.mockResolvedValue(mockProductBatchNumber as any);
            prismaMock.productBatchNumber.delete.mockResolvedValue(mockProductBatchNumber as any);

            const result = await service.remove(1);

            expect(prismaMock.productBatchNumber.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    stocks: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                    stockMovements: {
                        include: {
                            product: true,
                            site: true,
                        },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.id).toEqual(1);
        });
    });
});
