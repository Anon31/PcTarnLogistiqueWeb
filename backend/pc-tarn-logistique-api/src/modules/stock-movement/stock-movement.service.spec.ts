import { Test, TestingModule } from '@nestjs/testing';
import { TypeMovement } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { StockMovementService } from './stock-movement.service';

describe('StockMovementService', () => {
    let service: StockMovementService;
    let prismaMock: MockPrismaService;

    const stockMovementRelations = {
        user: true,
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

            prismaMock.stockMovement.create.mockResolvedValue({
                id: 1,
                ...dto,
                user: { id: 1, email: 'admin@test.com' },
                site: { id: 1, code: 'ALB' },
                product: { id: 1, name: 'Compresses Steriles 10x10' },
                productBatchNumber: { id: 1, number: 'LOT-COMP-2027-01' },
            } as any);

            const result = await service.create(dto as any);

            expect(prismaMock.stockMovement.create).toHaveBeenCalledWith({
                data: dto,
            });
            expect(result.id).toEqual(1);
            expect(result.site.code).toEqual('ALB');
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les mouvements avec leurs relations', async () => {
            prismaMock.stockMovement.findMany.mockResolvedValue([] as any);

            await service.findAll();

            expect(prismaMock.stockMovement.findMany).toHaveBeenCalledWith({
                include: stockMovementRelations,
                orderBy: { id: 'asc' },
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
