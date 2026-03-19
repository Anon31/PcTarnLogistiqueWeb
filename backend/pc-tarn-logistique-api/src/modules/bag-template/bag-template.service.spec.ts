import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemCategory } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { BagTemplateService } from './bag-template.service';

describe('BagTemplateService', () => {
    let service: BagTemplateService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BagTemplateService, providePrismaMock()],
        }).compile();

        service = module.get<BagTemplateService>(BagTemplateService);
        prismaMock = module.get(PrismaService) as unknown as MockPrismaService;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('creates a bag template', async () => {
            const dto = { name: 'LOT B' };
            prismaMock.bagTemplate.create.mockResolvedValue({
                id: 1,
                ...dto,
                items: [],
            } as any);

            const result = await service.create(dto);

            expect(prismaMock.bagTemplate.create).toHaveBeenCalledWith({
                data: dto,
                include: {
                    items: {
                        include: { product: true },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.id).toEqual(1);
            expect(result.name).toEqual('LOT B');
        });
    });

    describe('findAll', () => {
        it('returns bag templates with ordered items', async () => {
            prismaMock.bagTemplate.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: 'LOT B',
                    items: [
                        {
                            id: 1,
                            expectedQuantity: 6,
                            bagTemplateId: 1,
                            productId: 3,
                            product: {
                                id: 3,
                                name: 'Compresses',
                                category: ItemCategory.PLAIE,
                                minThreshold: 5,
                                isPerishable: false,
                            },
                        },
                    ],
                },
            ] as any);

            const result = await service.findAll();

            expect(prismaMock.bagTemplate.findMany).toHaveBeenCalledWith({
                include: {
                    items: {
                        include: { product: true },
                        orderBy: { id: 'asc' },
                    },
                },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(1);
            expect(result[0].items?.[0].expectedQuantity).toEqual(6);
        });
    });

    describe('findOne', () => {
        it('returns a bag template when it exists', async () => {
            prismaMock.bagTemplate.findUnique.mockResolvedValue({
                id: 1,
                name: 'LOT B',
                items: [],
            } as any);

            const result = await service.findOne(1);

            expect(prismaMock.bagTemplate.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    items: {
                        include: { product: true },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.name).toEqual('LOT B');
        });

        it('throws NotFoundException when the bag template does not exist', async () => {
            prismaMock.bagTemplate.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('updates a bag template', async () => {
            prismaMock.bagTemplate.findUnique.mockResolvedValue({
                id: 1,
                name: 'LOT B',
                items: [],
            } as any);
            prismaMock.bagTemplate.update.mockResolvedValue({
                id: 1,
                name: 'LOT B Renforce',
                items: [],
            } as any);

            const dto = { name: 'LOT B Renforce' };
            const result = await service.update(1, dto);

            expect(prismaMock.bagTemplate.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dto,
                include: {
                    items: {
                        include: { product: true },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.name).toEqual('LOT B Renforce');
        });
    });

    describe('remove', () => {
        it('deletes a bag template when the ID exists', async () => {
            const mockBagTemplate = {
                id: 1,
                name: 'LOT B',
                items: [],
            };

            prismaMock.bagTemplate.findUnique.mockResolvedValue(mockBagTemplate as any);
            prismaMock.bagTemplate.delete.mockResolvedValue(mockBagTemplate as any);

            const result = await service.remove(1);

            expect(prismaMock.bagTemplate.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    items: {
                        include: { product: true },
                        orderBy: { id: 'asc' },
                    },
                },
            });
            expect(result.id).toEqual(1);
        });
    });
});
