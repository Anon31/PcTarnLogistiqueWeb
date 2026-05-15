import { Test, TestingModule } from '@nestjs/testing';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { StockMovementService } from '../stock-movement/stock-movement.service';

describe('SiteController', () => {
    let controller: SiteController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SiteController],
            providers: [
                {
                    provide: SiteService,
                    useValue: {},
                },
                {
                    provide: StockMovementService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<SiteController>(SiteController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });
});
