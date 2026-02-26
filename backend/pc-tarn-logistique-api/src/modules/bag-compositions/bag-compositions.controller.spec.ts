import { Test, TestingModule } from '@nestjs/testing';
import { BagCompositionsController } from './bag-compositions.controller';
import { BagCompositionsService } from './bag-compositions.service';

describe('BagCompositionsController', () => {
  let controller: BagCompositionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BagCompositionsController],
      providers: [
        {
          provide: BagCompositionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BagCompositionsController>(BagCompositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
