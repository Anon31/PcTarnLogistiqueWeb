import { Test, TestingModule } from '@nestjs/testing';
import { providePrismaMock } from '../../mocks/prisma-mock';
import { BagCompositionsService } from './bag-compositions.service';

describe('BagCompositionsService', () => {
  let service: BagCompositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BagCompositionsService, providePrismaMock()],
    }).compile();

    service = module.get<BagCompositionsService>(BagCompositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
