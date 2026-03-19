import { Test, TestingModule } from '@nestjs/testing';
import { BagTemplateItemController } from './bag-template-item.controller';
import { BagTemplateItemService } from './bag-template-item.service';

describe('BagTemplateItemController', () => {
    let controller: BagTemplateItemController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BagTemplateItemController],
            providers: [
                {
                    provide: BagTemplateItemService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BagTemplateItemController>(BagTemplateItemController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
