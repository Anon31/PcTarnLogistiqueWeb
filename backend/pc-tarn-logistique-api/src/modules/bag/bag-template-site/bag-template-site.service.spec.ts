import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SiteType } from '@prisma/client';
import { MockPrismaService, providePrismaMock } from '../../../mocks/prisma-mock';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateSiteService } from './bag-template-site.service';

describe('BagTemplateSiteService', () => {
    let service: BagTemplateSiteService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BagTemplateSiteService, providePrismaMock()],
        }).compile();

        service = module.get<BagTemplateSiteService>(BagTemplateSiteService);
        prismaMock = module.get(PrismaService);
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit créer un lien entre un site et un modèle de sac', async () => {
            const dto = {
                siteId: 1,
                bagTemplateId: 2,
            };
            prismaMock.bagTemplateSite.create.mockResolvedValue({
                id: 1,
                ...dto,
                site: {
                    id: 1,
                    name: 'Sac 814A',
                    type: SiteType.OUTDOOR,
                    code: '814A',
                },
                bagTemplate: {
                    id: 2,
                    name: 'LOT A',
                },
            } as any);

            const result = await service.create(dto);

            expect(prismaMock.bagTemplateSite.create).toHaveBeenCalledWith({
                data: dto,
                include: { site: true, bagTemplate: true },
            });
            expect(result.id).toEqual(1);
            expect(result.bagTemplate?.name).toEqual('LOT A');
        });
    });

    describe('findAll', () => {
        it('doit retourner tous les liens site/modèle de sac avec leurs relations', async () => {
            prismaMock.bagTemplateSite.findMany.mockResolvedValue([
                {
                    id: 1,
                    siteId: 1,
                    bagTemplateId: 2,
                    site: {
                        id: 1,
                        name: 'Sac 814A',
                        type: SiteType.OUTDOOR,
                        code: '814A',
                    },
                    bagTemplate: {
                        id: 2,
                        name: 'LOT A',
                    },
                },
            ] as any);

            const result = await service.findAll();

            expect(prismaMock.bagTemplateSite.findMany).toHaveBeenCalledWith({
                include: { site: true, bagTemplate: true },
                orderBy: { id: 'asc' },
            });
            expect(result).toHaveLength(1);
            expect(result[0].site?.code).toEqual('814A');
        });
    });

    describe('findOne', () => {
        it("doit retourner un lien site/modèle de sac si l'ID existe", async () => {
            prismaMock.bagTemplateSite.findUnique.mockResolvedValue({
                id: 1,
                siteId: 1,
                bagTemplateId: 2,
                site: {
                    id: 1,
                    name: 'Sac 814A',
                    type: SiteType.OUTDOOR,
                    code: '814A',
                },
                bagTemplate: {
                    id: 2,
                    name: 'LOT A',
                },
            } as any);

            const result = await service.findOne(1);

            expect(prismaMock.bagTemplateSite.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { site: true, bagTemplate: true },
            });
            expect(result.siteId).toEqual(1);
        });

        it("doit lever une NotFoundException si le lien site/modèle de sac n'existe pas", async () => {
            prismaMock.bagTemplateSite.findUnique.mockResolvedValue(null as any);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('doit mettre à jour un lien site/modèle de sac', async () => {
            prismaMock.bagTemplateSite.findUnique.mockResolvedValue({
                id: 1,
                siteId: 1,
                bagTemplateId: 2,
                site: {
                    id: 1,
                    name: 'Sac 814A',
                    type: SiteType.OUTDOOR,
                    code: '814A',
                },
                bagTemplate: {
                    id: 2,
                    name: 'LOT A',
                },
            } as any);
            prismaMock.bagTemplateSite.update.mockResolvedValue({
                id: 1,
                siteId: 1,
                bagTemplateId: 3,
                site: {
                    id: 1,
                    name: 'Sac 814A',
                    type: SiteType.OUTDOOR,
                    code: '814A',
                },
                bagTemplate: {
                    id: 3,
                    name: 'LOT B',
                },
            } as any);

            const dto = {
                bagTemplateId: 3,
            };
            const result = await service.update(1, dto);

            expect(prismaMock.bagTemplateSite.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: dto,
                include: { site: true, bagTemplate: true },
            });
            expect(result.bagTemplateId).toEqual(3);
        });
    });

    describe('remove', () => {
        it("doit supprimer un lien site/modèle de sac si l'ID existe", async () => {
            const mockBagTemplateSite = {
                id: 1,
                siteId: 1,
                bagTemplateId: 2,
                site: {
                    id: 1,
                    name: 'Sac 814A',
                    type: SiteType.OUTDOOR,
                    code: '814A',
                },
                bagTemplate: {
                    id: 2,
                    name: 'LOT A',
                },
            };

            prismaMock.bagTemplateSite.findUnique.mockResolvedValue(mockBagTemplateSite as any);
            prismaMock.bagTemplateSite.delete.mockResolvedValue(mockBagTemplateSite as any);

            const result = await service.remove(1);

            expect(prismaMock.bagTemplateSite.delete).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { site: true, bagTemplate: true },
            });
            expect(result.id).toEqual(1);
        });
    });
});
