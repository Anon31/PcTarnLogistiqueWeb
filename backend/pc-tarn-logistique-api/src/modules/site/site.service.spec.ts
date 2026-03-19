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

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('creates a site with its address', async () => {
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
                include: { address: true },
            });
            expect(result.id).toEqual(1);
            expect(result.address?.city).toEqual('Albi');
        });
    });

    describe('findAll', () => {
        it('returns all sites ordered by ID', async () => {
            prismaMock.site.findMany.mockResolvedValue([
                {
                    id: 1,
                    name: "Antenne d'Albi",
                    code: 'ALB',
                    type: SiteType.INDOOR,
                    address: null,
                },
                {
                    id: 2,
                    name: 'Sac 814A',
                    code: '814A',
                    type: SiteType.OUTDOOR,
                    address: null,
                },
            ] as any);

            const result = await service.findAll();

            expect(prismaMock.site.findMany).toHaveBeenCalledWith({
                include: { address: true },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(2);
            expect(result[1].type).toEqual(SiteType.OUTDOOR);
        });
    });

    describe('findOne', () => {
        it('returns a site when it exists', async () => {
            prismaMock.site.findUnique.mockResolvedValue({
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
            } as any);

            const result = await service.findOne(1);

            expect(prismaMock.site.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { address: true },
            });
            expect(result.code).toEqual('ALB');
        });

        it('throws NotFoundException when the site does not exist', async () => {
            prismaMock.site.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('updates a site and upserts its address', async () => {
            prismaMock.site.findUnique.mockResolvedValue({
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
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
                include: { address: true },
            });
            expect(result.name).toEqual('Antenne Albi Centre');
            expect(result.address?.number).toEqual(10);
        });
    });

    describe('remove', () => {
        it('deletes a site when the ID exists', async () => {
            const mockSite = {
                id: 1,
                name: "Antenne d'Albi",
                code: 'ALB',
                type: SiteType.INDOOR,
                address: null,
            };

            prismaMock.site.findUnique.mockResolvedValue(mockSite as any);
            prismaMock.site.delete.mockResolvedValue(mockSite as any);

            const result = await service.remove(1);

            expect(prismaMock.site.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { address: true },
            });
            expect(result.id).toEqual(1);
        });
    });
});
