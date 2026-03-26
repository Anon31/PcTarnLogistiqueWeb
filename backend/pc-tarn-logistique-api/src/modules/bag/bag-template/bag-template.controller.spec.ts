import { Test, TestingModule } from '@nestjs/testing';
import { BagTemplateController } from './bag-template.controller';
import { BagTemplateService } from './bag-template.service';

describe('BagTemplateController', () => {
    let controller: BagTemplateController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BagTemplateController],
            providers: [
                {
                    provide: BagTemplateService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BagTemplateController>(BagTemplateController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });
});
