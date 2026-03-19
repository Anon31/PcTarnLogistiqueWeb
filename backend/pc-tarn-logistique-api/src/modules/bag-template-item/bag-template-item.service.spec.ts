import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemCategory } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { BagTemplateItemService } from './bag-template-item.service';

describe('BagTemplateItemService', () => {
    let service: BagTemplateItemService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BagTemplateItemService, providePrismaMock()],
        }).compile();

        service = module.get<BagTemplateItemService>(BagTemplateItemService);
        prismaMock = module.get(PrismaService) as unknown as MockPrismaService;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('creates a bag template item', async () => {
            const dto = {
                expectedQuantity: 6,
                bagTemplateId: 1,
                productId: 3,
            };
            prismaMock.bagTemplateItem.create.mockResolvedValue({
                id: 1,
                ...dto,
                bagTemplate: { id: 1, name: 'LOT B' },
                product: {
                    id: 3,
                    name: 'Compresses',
                    category: ItemCategory.PLAIE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            } as any);

            const result = await service.create(dto);

            expect(prismaMock.bagTemplateItem.create).toHaveBeenCalledWith({
                data: dto,
                include: { bagTemplate: true, product: true },
            });
            expect(result.id).toEqual(1);
            expect(result.product?.name).toEqual('Compresses');
        });
    });

    describe('findAll', () => {
        it('returns bag template items with relations', async () => {
            prismaMock.bagTemplateItem.findMany.mockResolvedValue([
                {
                    id: 1,
                    expectedQuantity: 6,
                    bagTemplateId: 1,
                    productId: 3,
                    bagTemplate: { id: 1, name: 'LOT B' },
                    product: {
                        id: 3,
                        name: 'Compresses',
                        category: ItemCategory.PLAIE,
                        minThreshold: 5,
                        isPerishable: false,
                    },
                },
            ] as any);

            const result = await service.findAll();

            expect(prismaMock.bagTemplateItem.findMany).toHaveBeenCalledWith({
                include: { bagTemplate: true, product: true },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(1);
            expect(result[0].expectedQuantity).toEqual(6);
        });
    });

    describe('findOne', () => {
        it('returns a bag template item when it exists', async () => {
            prismaMock.bagTemplateItem.findUnique.mockResolvedValue({
                id: 1,
                expectedQuantity: 6,
                bagTemplateId: 1,
                productId: 3,
                bagTemplate: { id: 1, name: 'LOT B' },
                product: {
                    id: 3,
                    name: 'Compresses',
                    category: ItemCategory.PLAIE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            } as any);

            const result = await service.findOne(1);

            expect(prismaMock.bagTemplateItem.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { bagTemplate: true, product: true },
            });
            expect(result.bagTemplate?.name).toEqual('LOT B');
        });

        it('throws NotFoundException when the bag template item does not exist', async () => {
            prismaMock.bagTemplateItem.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('updates a bag template item', async () => {
            prismaMock.bagTemplateItem.findUnique.mockResolvedValue({
                id: 1,
                expectedQuantity: 6,
                bagTemplateId: 1,
                productId: 3,
                bagTemplate: { id: 1, name: 'LOT B' },
                product: {
                    id: 3,
                    name: 'Compresses',
                    category: ItemCategory.PLAIE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            } as any);
            prismaMock.bagTemplateItem.update.mockResolvedValue({
                id: 1,
                expectedQuantity: 8,
                bagTemplateId: 1,
                productId: 4,
                bagTemplate: { id: 1, name: 'LOT B' },
                product: {
                    id: 4,
                    name: 'Serum',
                    category: ItemCategory.MALAISE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            } as any);

            const dto = {
                expectedQuantity: 8,
                productId: 4,
            };
            const result = await service.update(1, dto);

            expect(prismaMock.bagTemplateItem.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dto,
                include: { bagTemplate: true, product: true },
            });
            expect(result.expectedQuantity).toEqual(8);
            expect(result.productId).toEqual(4);
        });
    });

    describe('remove', () => {
        it('deletes a bag template item when the ID exists', async () => {
            const mockBagTemplateItem = {
                id: 1,
                expectedQuantity: 6,
                bagTemplateId: 1,
                productId: 3,
                bagTemplate: { id: 1, name: 'LOT B' },
                product: {
                    id: 3,
                    name: 'Compresses',
                    category: ItemCategory.PLAIE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            };

            prismaMock.bagTemplateItem.findUnique.mockResolvedValue(mockBagTemplateItem as any);
            prismaMock.bagTemplateItem.delete.mockResolvedValue(mockBagTemplateItem as any);

            const result = await service.remove(1);

            expect(prismaMock.bagTemplateItem.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { bagTemplate: true, product: true },
            });
            expect(result.id).toEqual(1);
        });
    });
});
