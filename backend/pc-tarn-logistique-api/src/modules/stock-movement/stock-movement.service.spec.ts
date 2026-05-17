import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeMovement } from '@prisma/client';
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
        it('doit creer un mouvement INPUT et incrementer le stock', async () => {
            const dto = {
                userId: 1,
                siteId: 1,
                productId: 1,
                productBatchNumberId: 1,
                type: TypeMovement.INPUT,
                createdAt: new Date('2026-05-15T10:00:00.000Z'),
                quantity: 10,
            };

            const createdMovement = { id: 1, ...dto };
            const expectedWhere = {
                siteId: 1,
                productId: 1,
                ProductBatchNumberId: 1,
            };
            const stockResult = { id: 123, quantity: 999 };

            prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
            prismaMock.stockMovement.create.mockResolvedValue(createdMovement as any);
            prismaMock.stock.updateMany.mockResolvedValue({ count: 1 } as any);
            prismaMock.stock.findFirst.mockResolvedValue(stockResult as any);

            const result = await service.create(dto as any);

            expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
            expect(prismaMock.stockMovement.create).toHaveBeenCalledWith({ data: dto });
            expect(prismaMock.stock.updateMany).toHaveBeenCalledWith({
                where: expectedWhere,
                data: { quantity: { increment: 10 } },
            });
            expect(prismaMock.stock.findFirst).toHaveBeenCalledWith({ where: expectedWhere });
            expect(result).toEqual(stockResult);
        });

        it('doit creer un mouvement OUTPUT et decrementer le stock si stock > 0', async () => {
            const dto = {
                userId: 1,
                siteId: 1,
                productId: 1,
                productBatchNumberId: 1,
                type: TypeMovement.OUTPUT,
                createdAt: new Date('2026-05-15T10:00:00.000Z'),
                quantity: 10,
            };

            const createdMovement = { id: 1, ...dto };
            const expectedWhere = {
                siteId: 1,
                productId: 1,
                ProductBatchNumberId: 1,
            };
            const stockResult = { id: 123, quantity: 5 };

            prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
            prismaMock.stockMovement.create.mockResolvedValue(createdMovement as any);
            prismaMock.stock.updateMany.mockResolvedValue({ count: 1 } as any);
            prismaMock.stock.findFirst
                .mockResolvedValueOnce({ id: 1, quantity: 20 } as any) // check stock before decrement
                .mockResolvedValueOnce(stockResult as any); // return final stock

            const result = await service.create(dto as any);

            expect(prismaMock.stock.updateMany).toHaveBeenCalledWith({
                where: expectedWhere,
                data: { quantity: { decrement: 10 } },
            });
            expect(prismaMock.stock.findFirst).toHaveBeenCalledTimes(2);
            expect(result).toEqual(stockResult);
        });

        it('doit retourner une BadRequestException si OUTPUT et stock vide', async () => {
            const dto = {
                userId: 1,
                siteId: 1,
                productId: 1,
                productBatchNumberId: 1,
                type: TypeMovement.OUTPUT,
                createdAt: new Date('2026-05-15T10:00:00.000Z'),
                quantity: 10,
            };

            prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
            prismaMock.stockMovement.create.mockResolvedValue({ id: 1, ...dto } as any);
            prismaMock.stock.findFirst.mockResolvedValueOnce(null as any);

            const result = await service.create(dto as any);

            expect(result).toBeInstanceOf(BadRequestException);
            expect(prismaMock.stock.updateMany).not.toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les mouvements avec leurs relations', async () => {
            prismaMock.stockMovement.findMany.mockResolvedValue([] as any);

            await service.findAll();

            expect(prismaMock.stockMovement.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                include: stockMovementRelations,
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
