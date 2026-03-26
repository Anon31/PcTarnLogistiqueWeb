import { Test, TestingModule } from '@nestjs/testing';
import { SystemService } from './system.service';

describe('SystemService', () => {
    let service: SystemService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SystemService],
        }).compile();

        service = module.get<SystemService>(SystemService);
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });
});
