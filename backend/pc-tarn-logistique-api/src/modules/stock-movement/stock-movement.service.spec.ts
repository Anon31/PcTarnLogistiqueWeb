import { Test, TestingModule } from '@nestjs/testing';
import { TypeMovement } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { StockMovementService } from './stock-movement.service';

describe('StockMovementService', () => {
    let service: StockMovementService;
    let prismaMock: MockPrismaService;

    const stockMovementRelations = {
        productBatchNumber: true,
        site: true,
        product: true,
    } as const;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StockMovementService, providePrismaMock()],
        }).compile();

        service = module.get<StockMovementService>(StockMovementService);
        prismaMock = module.get(PrismaService);
    });

    it('doit etre defini', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit creer un mouvement de stock ', async () => {
            const dto = {
                userId: 1,
                siteId: 1,
                productId: 1,
                productBatchNumberId: 1,
                type: TypeMovement.INPUT,
                createdAt: new Date('2026-05-15T10:00:00.000Z'),
                quantity: 10,
            };

            prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
            prismaMock.stock.updateMany.mockResolvedValue({ count: 1 } as any);
            prismaMock.stockMovement.findFirst.mockResolvedValue(null as any);
            prismaMock.stockMovement.create.mockResolvedValue({
                id: 1,
                ...dto,
            } as any);
            prismaMock.stock.findFirst.mockResolvedValue({
                id: 1,
                siteId: 1,
                productId: 1,
                ProductBatchNumberId: 1,
                quantity: 999,
            } as any);

            const result = await service.create(dto as any);

            expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
            expect(prismaMock.stockMovement.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.stockMovement.create).toHaveBeenCalledWith({
                data: dto,
            });
            expect(result.newStockMovement.id).toEqual(1);

            const expectedWhere = {
                siteId: 1,
                productId: 1,
                ProductBatchNumberId: 1,
            };

            expect(prismaMock.stock.updateMany).toHaveBeenCalledTimes(1);
            expect(prismaMock.stock.updateMany).toHaveBeenCalledWith({
                where: expectedWhere,
                data: { quantity: { increment: 10 } },
            });
            expect(prismaMock.stock.findFirst).toHaveBeenCalledWith({ where: expectedWhere });
        });
    });

    describe('Should be unique', () => {
        it('doit lever une BadRequestException si un mouvement existe deja avec le meme createdAt', async () => {
            const createdAt = new Date('2026-05-15T10:00:00.000Z');
            const dto = {
                userId: 1,
                siteId: 1,
                productId: 1,
                productBatchNumberId: 1,
                type: TypeMovement.INPUT,
                createdAt,
                quantity: 10,
            };

            prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
            prismaMock.stockMovement.findFirst.mockResolvedValue({ id: 42 } as any);

            await expect(service.create(dto as any)).rejects.toBeInstanceOf(BadRequestException);
            expect(prismaMock.stockMovement.create).not.toHaveBeenCalled();
            expect(prismaMock.stock.updateMany).not.toHaveBeenCalled();
            expect(prismaMock.stockMovement.findFirst).toHaveBeenCalledWith({
                where: { createdAt },
                select: { id: true },
            });
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les mouvements avec leurs relations', async () => {
            prismaMock.stockMovement.findMany.mockResolvedValue([] as any);

            await service.findAll();

            expect(prismaMock.stockMovement.findMany).toHaveBeenCalledWith({
                include: stockMovementRelations,
                orderBy: { createdAt: 'desc' },
            });
        });
    });

    describe('findOne', () => {
        it('doit chercher un mouvement avec ses relations', async () => {
            prismaMock.stockMovement.findFirst.mockResolvedValue({ id: 123 } as any);

            await service.findOne(123);

            expect(prismaMock.stockMovement.findFirst).toHaveBeenCalledWith({
                where: { id: 123 },
                include: stockMovementRelations,
            });
        });
    });

    describe('findAllBySite', () => {
        it('doit retourner les mouvements du site avec leurs relations', async () => {
            prismaMock.stockMovement.findMany.mockResolvedValue([] as any);

            await service.findAllBySite(1);

            expect(prismaMock.stockMovement.findMany).toHaveBeenCalledWith({
                where: { siteId: 1 },
                include: stockMovementRelations,
                orderBy: { id: 'asc' },
            });
        });
    });

    describe('findLastBySite', () => {
        it('doit retourner le dernier mouvement (createdAt desc) avec ses relations', async () => {
            prismaMock.stockMovement.findFirst.mockResolvedValue({ id: 999 } as any);

            await service.findLastBySite(1);

            expect(prismaMock.stockMovement.findFirst).toHaveBeenCalledWith({
                where: { siteId: 1 },
                include: stockMovementRelations,
                orderBy: { createdAt: 'desc' },
                take: 1,
            });
        });
    });
});
