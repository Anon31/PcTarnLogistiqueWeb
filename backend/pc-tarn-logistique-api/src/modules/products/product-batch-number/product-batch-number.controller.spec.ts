import { Test, TestingModule } from '@nestjs/testing';
import { ProductBatchNumberController } from './product-batch-number.controller';
import { ProductBatchNumberService } from './product-batch-number.service';

describe('ProductBatchNumberController', () => {
    let controller: ProductBatchNumberController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductBatchNumberController],
            providers: [
                {
                    provide: ProductBatchNumberService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<ProductBatchNumberController>(ProductBatchNumberController);
    });

    it('doit etre defini', () => {
        expect(controller).toBeDefined();
    });
});
