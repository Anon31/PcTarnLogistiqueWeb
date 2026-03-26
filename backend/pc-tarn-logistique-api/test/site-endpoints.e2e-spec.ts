import { INestApplication } from '@nestjs/common';
import { SiteType } from '@prisma/client';
import request from 'supertest';
import { SiteController } from '../src/modules/site/site.controller';
import { SiteService } from '../src/modules/site/site.service';
import { createControllerE2eApp } from './helpers/create-controller-e2e-app';

describe('Site endpoints (e2e)', () => {
    let app: INestApplication;

    const siteServiceMock = {
        create: jest.fn(),
        findAll: jest.fn(),
        findAllOutDoors: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    const sitePayload = {
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

    const siteResponse = {
        id: 1,
        ...sitePayload,
        bagTemplateId: null,
    };

    const outdoorSiteResponse = {
        id: 2,
        name: 'Sac 814A',
        code: '814A',
        type: SiteType.OUTDOOR,
        bagTemplateId: 1,
        address: null,
    };

    beforeAll(async () => {
        app = await createControllerE2eApp({
            controllers: [SiteController],
            providers: [
                {
                    provide: SiteService,
                    useValue: siteServiceMock,
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

    it('POST /api/v1/sites doit creer un site', async () => {
        siteServiceMock.create.mockResolvedValue(siteResponse);

        const response = await request(app.getHttpServer()).post('/api/v1/sites').send(sitePayload).expect(201);

        expect(response.body).toEqual(siteResponse);
        expect(siteServiceMock.create).toHaveBeenCalledWith(sitePayload);
    });

    it('POST /api/v1/sites doit refuser un payload invalide', async () => {
        await request(app.getHttpServer())
            .post('/api/v1/sites')
            .send({
                name: 'Site test',
                code: 'TST',
                type: SiteType.INDOOR,
                extraField: true,
            })
            .expect(400);

        expect(siteServiceMock.create).not.toHaveBeenCalled();
    });

    it('GET /api/v1/sites doit retourner tous les sites', async () => {
        siteServiceMock.findAll.mockResolvedValue([siteResponse, outdoorSiteResponse]);

        const response = await request(app.getHttpServer()).get('/api/v1/sites').expect(200);

        expect(response.body).toEqual([siteResponse, outdoorSiteResponse]);
        expect(siteServiceMock.findAll).toHaveBeenCalledWith();
    });

    it('GET /api/v1/sites/type/outdoors doit retourner les sites outdoor', async () => {
        siteServiceMock.findAllOutDoors.mockResolvedValue([outdoorSiteResponse]);

        const response = await request(app.getHttpServer()).get('/api/v1/sites/type/outdoors').expect(200);

        expect(response.body).toEqual([outdoorSiteResponse]);
        expect(siteServiceMock.findAllOutDoors).toHaveBeenCalledWith();
        expect(siteServiceMock.findOne).not.toHaveBeenCalled();
    });

    it('GET /api/v1/sites/:id doit retourner un site', async () => {
        siteServiceMock.findOne.mockResolvedValue(siteResponse);

        const response = await request(app.getHttpServer()).get('/api/v1/sites/1').expect(200);

        expect(response.body).toEqual(siteResponse);
        expect(siteServiceMock.findOne).toHaveBeenCalledWith(1);
    });

    it('GET /api/v1/sites/:id doit refuser un id invalide', async () => {
        await request(app.getHttpServer()).get('/api/v1/sites/not-a-number').expect(400);

        expect(siteServiceMock.findOne).not.toHaveBeenCalled();
    });

    it('PATCH /api/v1/sites/:id doit mettre a jour un site', async () => {
        const updatePayload = {
            name: 'Antenne Albi Centre',
            address: {
                number: 10,
                street: 'Avenue de Lattre de Tassigny',
                city: 'Albi',
                zipcode: '81000',
                state: 'France',
            },
        };
        const updatedSiteResponse = {
            ...siteResponse,
            name: 'Antenne Albi Centre',
            address: updatePayload.address,
        };

        siteServiceMock.update.mockResolvedValue(updatedSiteResponse);

        const response = await request(app.getHttpServer()).patch('/api/v1/sites/1').send(updatePayload).expect(200);

        expect(response.body).toEqual(updatedSiteResponse);
        expect(siteServiceMock.update).toHaveBeenCalledWith(1, updatePayload);
    });

    it('DELETE /api/v1/sites/:id doit supprimer un site', async () => {
        siteServiceMock.remove.mockResolvedValue(siteResponse);

        const response = await request(app.getHttpServer()).delete('/api/v1/sites/1').expect(200);

        expect(response.body).toEqual(siteResponse);
        expect(siteServiceMock.remove).toHaveBeenCalledWith(1);
    });
});
