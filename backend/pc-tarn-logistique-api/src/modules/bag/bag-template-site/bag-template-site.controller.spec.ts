import { Test, TestingModule } from '@nestjs/testing';
import { BagTemplateSiteController } from './bag-template-site.controller';
import { BagTemplateSiteService } from './bag-template-site.service';

describe('BagTemplateSiteController', () => {
    let controller: BagTemplateSiteController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BagTemplateSiteController],
            providers: [
                {
                    provide: BagTemplateSiteService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BagTemplateSiteController>(BagTemplateSiteController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });
});
