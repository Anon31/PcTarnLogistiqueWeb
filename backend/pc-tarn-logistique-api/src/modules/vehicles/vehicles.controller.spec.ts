import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
    let controller: VehiclesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [VehiclesController],
            providers: [
                // PRINCIPE D'ISOLATION :
                // Un test unitaire de contrôleur ne doit tester que le "routage".
                // On ne fournit donc pas le vrai PrismaService. À la place, on donne au
                // contrôleur une fausse version (mock) de son VehiclesService.
                {
                    provide: VehiclesService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Ambulance Test' }]),
                        findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Ambulance Test' }),
                        create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 2, ...dto })),
                        update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
                        remove: jest.fn().mockResolvedValue({ id: 1, name: 'Ambulance Supprimée' }),
                        findAlllots: jest.fn().mockResolvedValue({ message: 'OK', datas: [] }),
                    },
                },
            ],
        }).compile();

        controller = module.get<VehiclesController>(VehiclesController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });

    it('doit récupérer la liste des véhicules via le service mocké', async () => {
        const result = await controller.findAll();
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual('Ambulance Test');
    });
});
