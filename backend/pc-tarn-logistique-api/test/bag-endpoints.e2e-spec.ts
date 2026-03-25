import { INestApplication } from '@nestjs/common';
import { ItemCategory, SiteType } from '@prisma/client';
import request from 'supertest';
import { BagTemplateController } from '../src/modules/bag/bag-template/bag-template.controller';
import { BagTemplateService } from '../src/modules/bag/bag-template/bag-template.service';
import { BagTemplateItemController } from '../src/modules/bag/bag-template-item/bag-template-item.controller';
import { BagTemplateItemService } from '../src/modules/bag/bag-template-item/bag-template-item.service';
import { BagTemplateSiteController } from '../src/modules/bag/bag-template-site/bag-template-site.controller';
import { BagTemplateSiteService } from '../src/modules/bag/bag-template-site/bag-template-site.service';
import { createControllerE2eApp } from './helpers/create-controller-e2e-app';

describe('Bag endpoints (e2e)', () => {
    let app: INestApplication;

    const bagTemplateServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const bagTemplateItemServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const bagTemplateSiteServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const bagTemplatePayload = {
        name: 'LOT B',
    };

    const bagTemplateResponse = {
        id: 1,
        ...bagTemplatePayload,
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
    };

    const bagTemplateItemPayload = {
        expectedQuantity: 6,
        bagTemplateId: 1,
        productId: 3,
    };

    const bagTemplateItemResponse = {
        id: 1,
        ...bagTemplateItemPayload,
        bagTemplate: {
            id: 1,
            name: 'LOT B',
        },
        product: {
            id: 3,
            name: 'Compresses',
            category: ItemCategory.PLAIE,
            minThreshold: 5,
            isPerishable: false,
        },
    };

    const bagTemplateSitePayload = {
        siteId: 1,
        bagTemplateId: 1,
    };

    const bagTemplateSiteResponse = {
        id: 1,
        ...bagTemplateSitePayload,
        site: {
            id: 1,
            name: 'Sac 814A',
            type: SiteType.OUTDOOR,
            code: '814A',
        },
        bagTemplate: {
            id: 1,
            name: 'LOT B',
        },
    };

    beforeAll(async () => {
        app = await createControllerE2eApp({
            controllers: [BagTemplateController, BagTemplateItemController, BagTemplateSiteController],
            providers: [
                {
                    provide: BagTemplateService,
                    useValue: bagTemplateServiceMock,
                },
                {
                    provide: BagTemplateItemService,
                    useValue: bagTemplateItemServiceMock,
                },
                {
                    provide: BagTemplateSiteService,
                    useValue: bagTemplateSiteServiceMock,
                },
            ],
        });
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('BagTemplateController', () => {
        it('POST /api/v1/bag-templates doit creer un modele de sac', async () => {
            bagTemplateServiceMock.create.mockResolvedValue(bagTemplateResponse);

            const response = await request(app.getHttpServer())
                .post('/api/v1/bag-templates')
                .send(bagTemplatePayload)
                .expect(201);

            expect(response.body).toEqual(bagTemplateResponse);
            expect(bagTemplateServiceMock.create).toHaveBeenCalledWith(bagTemplatePayload);
        });

        it('POST /api/v1/bag-templates doit refuser un payload invalide', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/bag-templates')
                .send({
                    name: 'LOT B',
                    extraField: true,
                })
                .expect(400);

            expect(bagTemplateServiceMock.create).not.toHaveBeenCalled();
        });

        it('GET /api/v1/bag-templates doit retourner tous les modeles de sac', async () => {
            bagTemplateServiceMock.findAll.mockResolvedValue([bagTemplateResponse]);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-templates').expect(200);

            expect(response.body).toEqual([bagTemplateResponse]);
            expect(bagTemplateServiceMock.findAll).toHaveBeenCalledWith();
        });

        it('GET /api/v1/bag-templates/:id doit retourner un modele de sac', async () => {
            bagTemplateServiceMock.findOne.mockResolvedValue(bagTemplateResponse);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-templates/1').expect(200);

            expect(response.body).toEqual(bagTemplateResponse);
            expect(bagTemplateServiceMock.findOne).toHaveBeenCalledWith(1);
        });

        it('GET /api/v1/bag-templates/:id doit refuser un id invalide', async () => {
            await request(app.getHttpServer()).get('/api/v1/bag-templates/not-a-number').expect(400);

            expect(bagTemplateServiceMock.findOne).not.toHaveBeenCalled();
        });

        it('PATCH /api/v1/bag-templates/:id doit mettre a jour un modele de sac', async () => {
            const updatePayload = { name: 'LOT B Renforce' };
            const updatedBagTemplateResponse = {
                ...bagTemplateResponse,
                name: 'LOT B Renforce',
            };

            bagTemplateServiceMock.update.mockResolvedValue(updatedBagTemplateResponse);

            const response = await request(app.getHttpServer())
                .patch('/api/v1/bag-templates/1')
                .send(updatePayload)
                .expect(200);

            expect(response.body).toEqual(updatedBagTemplateResponse);
            expect(bagTemplateServiceMock.update).toHaveBeenCalledWith(1, updatePayload);
        });

        it('DELETE /api/v1/bag-templates/:id doit supprimer un modele de sac', async () => {
            bagTemplateServiceMock.remove.mockResolvedValue(bagTemplateResponse);

            const response = await request(app.getHttpServer()).delete('/api/v1/bag-templates/1').expect(200);

            expect(response.body).toEqual(bagTemplateResponse);
            expect(bagTemplateServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });

    describe('BagTemplateItemController', () => {
        it('POST /api/v1/bag-template-items doit creer un article theorique', async () => {
            bagTemplateItemServiceMock.create.mockResolvedValue(bagTemplateItemResponse);

            const response = await request(app.getHttpServer())
                .post('/api/v1/bag-template-items')
                .send({
                    expectedQuantity: '6',
                    bagTemplateId: '1',
                    productId: '3',
                })
                .expect(201);

            expect(response.body).toEqual(bagTemplateItemResponse);
            expect(bagTemplateItemServiceMock.create).toHaveBeenCalledWith(bagTemplateItemPayload);
        });

        it('POST /api/v1/bag-template-items doit refuser un payload invalide', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/bag-template-items')
                .send({
                    expectedQuantity: -1,
                    bagTemplateId: 1,
                    productId: 3,
                })
                .expect(400);

            expect(bagTemplateItemServiceMock.create).not.toHaveBeenCalled();
        });

        it('GET /api/v1/bag-template-items doit retourner tous les articles theoriques', async () => {
            bagTemplateItemServiceMock.findAll.mockResolvedValue([bagTemplateItemResponse]);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-template-items').expect(200);

            expect(response.body).toEqual([bagTemplateItemResponse]);
            expect(bagTemplateItemServiceMock.findAll).toHaveBeenCalledWith();
        });

        it('GET /api/v1/bag-template-items/:id doit retourner un article theorique', async () => {
            bagTemplateItemServiceMock.findOne.mockResolvedValue(bagTemplateItemResponse);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-template-items/1').expect(200);

            expect(response.body).toEqual(bagTemplateItemResponse);
            expect(bagTemplateItemServiceMock.findOne).toHaveBeenCalledWith(1);
        });

        it('GET /api/v1/bag-template-items/:id doit refuser un id invalide', async () => {
            await request(app.getHttpServer()).get('/api/v1/bag-template-items/not-a-number').expect(400);

            expect(bagTemplateItemServiceMock.findOne).not.toHaveBeenCalled();
        });

        it('PATCH /api/v1/bag-template-items/:id doit mettre a jour un article theorique', async () => {
            const updatePayload = {
                expectedQuantity: 8,
                productId: 4,
            };
            const updatedBagTemplateItemResponse = {
                ...bagTemplateItemResponse,
                expectedQuantity: 8,
                productId: 4,
                product: {
                    id: 4,
                    name: 'Serum',
                    category: ItemCategory.MALAISE,
                    minThreshold: 5,
                    isPerishable: false,
                },
            };

            bagTemplateItemServiceMock.update.mockResolvedValue(updatedBagTemplateItemResponse);

            const response = await request(app.getHttpServer())
                .patch('/api/v1/bag-template-items/1')
                .send(updatePayload)
                .expect(200);

            expect(response.body).toEqual(updatedBagTemplateItemResponse);
            expect(bagTemplateItemServiceMock.update).toHaveBeenCalledWith(1, updatePayload);
        });

        it('DELETE /api/v1/bag-template-items/:id doit supprimer un article theorique', async () => {
            bagTemplateItemServiceMock.remove.mockResolvedValue(bagTemplateItemResponse);

            const response = await request(app.getHttpServer()).delete('/api/v1/bag-template-items/1').expect(200);

            expect(response.body).toEqual(bagTemplateItemResponse);
            expect(bagTemplateItemServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });

    describe('BagTemplateSiteController', () => {
        it('POST /api/v1/bag-template-sites doit creer un lien site/modele de sac', async () => {
            bagTemplateSiteServiceMock.create.mockResolvedValue(bagTemplateSiteResponse);

            const response = await request(app.getHttpServer())
                .post('/api/v1/bag-template-sites')
                .send({
                    siteId: '1',
                    bagTemplateId: '1',
                })
                .expect(201);

            expect(response.body).toEqual(bagTemplateSiteResponse);
            expect(bagTemplateSiteServiceMock.create).toHaveBeenCalledWith(bagTemplateSitePayload);
        });

        it('POST /api/v1/bag-template-sites doit refuser un payload invalide', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/bag-template-sites')
                .send({
                    siteId: 0,
                    bagTemplateId: 1,
                })
                .expect(400);

            expect(bagTemplateSiteServiceMock.create).not.toHaveBeenCalled();
        });

        it('GET /api/v1/bag-template-sites doit retourner tous les liens site/modele de sac', async () => {
            bagTemplateSiteServiceMock.findAll.mockResolvedValue([bagTemplateSiteResponse]);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-template-sites').expect(200);

            expect(response.body).toEqual([bagTemplateSiteResponse]);
            expect(bagTemplateSiteServiceMock.findAll).toHaveBeenCalledWith();
        });

        it('GET /api/v1/bag-template-sites/:id doit retourner un lien site/modele de sac', async () => {
            bagTemplateSiteServiceMock.findOne.mockResolvedValue(bagTemplateSiteResponse);

            const response = await request(app.getHttpServer()).get('/api/v1/bag-template-sites/1').expect(200);

            expect(response.body).toEqual(bagTemplateSiteResponse);
            expect(bagTemplateSiteServiceMock.findOne).toHaveBeenCalledWith(1);
        });

        it('GET /api/v1/bag-template-sites/:id doit refuser un id invalide', async () => {
            await request(app.getHttpServer()).get('/api/v1/bag-template-sites/not-a-number').expect(400);

            expect(bagTemplateSiteServiceMock.findOne).not.toHaveBeenCalled();
        });

        it('PATCH /api/v1/bag-template-sites/:id doit mettre a jour un lien site/modele de sac', async () => {
            const updatePayload = {
                bagTemplateId: 2,
            };
            const updatedBagTemplateSiteResponse = {
                ...bagTemplateSiteResponse,
                bagTemplateId: 2,
                bagTemplate: {
                    id: 2,
                    name: 'LOT C',
                },
            };

            bagTemplateSiteServiceMock.update.mockResolvedValue(updatedBagTemplateSiteResponse);

            const response = await request(app.getHttpServer())
                .patch('/api/v1/bag-template-sites/1')
                .send(updatePayload)
                .expect(200);

            expect(response.body).toEqual(updatedBagTemplateSiteResponse);
            expect(bagTemplateSiteServiceMock.update).toHaveBeenCalledWith(1, updatePayload);
        });

        it('DELETE /api/v1/bag-template-sites/:id doit supprimer un lien site/modele de sac', async () => {
            bagTemplateSiteServiceMock.remove.mockResolvedValue(bagTemplateSiteResponse);

            const response = await request(app.getHttpServer()).delete('/api/v1/bag-template-sites/1').expect(200);

            expect(response.body).toEqual(bagTemplateSiteResponse);
            expect(bagTemplateSiteServiceMock.remove).toHaveBeenCalledWith(1);
        });
    });
});
