import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SiteType } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { SiteService } from './site.service';

describe('SiteService', () => {
    let service: SiteService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SiteService, providePrismaMock()],
        }).compile();

        service = module.get<SiteService>(SiteService);
        prismaMock = module.get(PrismaService) as unknown as MockPrismaService;
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit créer un site avec son adresse', async () => {
            const dto = {
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: {
                    number: 8,
                    street: 'Avenue de Lattre de Tassigny',
                    city: 'Albi',
                    zipcode: '81000',
                    state: 'France',
                },
            };

            prismaMock.site.create.mockResolvedValue({
                    id: 1,
                    ...dto,
                    address: {
                        id: 1,
                        ...dto.address,
                        userId: null,
                        siteId: 1,
                    },
                    bagChecks: [],
                } as any);

            const result = await service.create(dto);

            expect(prismaMock.site.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    code: dto.code,
                    type: dto.type,
                    address: {
                        create: dto.address,
                    },
                },
                include: { address: true, bagChecks: true },
            });
            expect(result.id).toEqual(1);
            expect(result.address?.city).toEqual('Albi');
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les sites triés par ID', async () => {
            prismaMock.site.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: "Antenne d'Albi",
                    code: 'ALB',
                    type: SiteType.INDOOR,
                    address: null,
                    bagChecks: [],
                },
                {
                    id: 2,
                    name: 'Sac 814A',
                    code: '814A',
                    type: SiteType.OUTDOOR,
                    address: null,
                    bagChecks: [],
                },
            ] as any);

            const result = await service.findAll();

            expect(prismaMock.site.findMany).toHaveBeenCalledWith({
                include: { address: true, bagChecks: true },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(2);
            expect(result[1].type).toEqual(SiteType.OUTDOOR);
            expect(result[0].address).toBeUndefined();
        });
    });

    describe('findAllOutDoors', () => {
        it('doit retourner uniquement les sites OUTDOOR avec les contrôles triés par date décroissante', async () => {
            prismaMock.site.findMany.mockResolvedValue([
                {
                    id: 2,
                    name: 'Sac 814A',
                    code: '814A',
                    type: SiteType.OUTDOOR,
                    address: null,
                    bagChecks: [
                        { id: 2, date: new Date('2026-03-22T09:00:00.000Z') },
                        { id: 1, date: new Date('2026-03-21T09:00:00.000Z') },
                    ],
                },
            ] as any);

            const result = await service.findAllOutDoors();

            expect(prismaMock.site.findMany).toHaveBeenCalledWith({
                where: { type: SiteType.OUTDOOR },
                include: {
                    address: true,
                    bagChecks: {
                        orderBy: { date: 'desc' },
                    },
                },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(1);
            expect(result[0].code).toEqual('814A');
        });
    });

    describe('findOne', () => {
        it("doit retourner un site si l'ID existe", async () => {
            prismaMock.site.findUnique.mockResolvedValue({
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
                bagChecks: [],
            } as any);

            const result = await service.findOne(1);

            expect(prismaMock.site.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { address: true, bagChecks: true },
            });
            expect(result.code).toEqual('ALB');
            expect(result.address).toBeUndefined();
        });

        it("doit lever une NotFoundException si le site n'existe pas", async () => {
            prismaMock.site.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('doit mettre à jour un site et faire un upsert de son adresse', async () => {
            prismaMock.site.findUnique.mockResolvedValue({
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
                bagChecks: [],
            } as any);
            prismaMock.site.update.mockResolvedValue({
                id: 1,
                name: 'Antenne Albi Centre',
                code: 'ALB',
                type: SiteType.INDOOR,
                address: {
                    id: 1,
                    number: 10,
                    street: 'Avenue de Lattre de Tassigny',
                    city: 'Albi',
                    zipcode: '81000',
                    state: 'France',
                    userId: null,
                    siteId: 1,
                },
                bagChecks: [],
            } as any);

            const dto = {
                name: 'Antenne Albi Centre',
                address: {
                    number: 10,
                    street: 'Avenue de Lattre de Tassigny',
                    city: 'Albi',
                    zipcode: '81000',
                    state: 'France',
                },
            };

            const result = await service.update(1, dto);

            expect(prismaMock.site.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: dto.name,
                    address: {
                        upsert: {
                            create: dto.address,
                            update: dto.address,
                        },
                    },
                },
                include: { address: true, bagChecks: true },
            });
            expect(result.name).toEqual('Antenne Albi Centre');
            expect(result.address?.number).toEqual(10);
        });
    });

    describe('remove', () => {
        it("doit supprimer un site si l'ID existe", async () => {
            const mockSite = {
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
                bagChecks: [],
            };

            prismaMock.site.findUnique.mockResolvedValue(mockSite as any);
            prismaMock.site.delete.mockResolvedValue(mockSite as any);

            const result = await service.remove(1);

            expect(prismaMock.site.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { address: true, bagChecks: true },
            });
            expect(result.id).toEqual(1);
            expect(result.address).toBeUndefined();
        });
    });
});
