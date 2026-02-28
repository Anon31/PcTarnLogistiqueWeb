import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        // Initialisation du module de test
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    // Nous mockons uniquement les méthodes du service qui sont utilisées par le contrôleur
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([{ id: 1, firstname: 'Bruce', lastname: 'Wayne' }]),
                        findOne: jest.fn().mockResolvedValue({ id: 1, firstname: 'Bruce', lastname: 'Wayne' }),
                        create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 2, ...dto })),
                        update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
                        remove: jest.fn().mockResolvedValue({ id: 1, firstname: 'Bruce', lastname: 'Wayne' }),
                        updatePassword: jest.fn().mockResolvedValue({ message: 'Mot de passe mis à jour avec succès' }),
                    },
                },
            ],
        }).compile();
        // Récupération de l'instance du contrôleur à partir du module de test
        controller = module.get<UsersController>(UsersController);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });

    // Test de la fonction findAll du contrôleur
    it('doit récupérer la liste des utilisateurs via le service', async () => {
        const result = await controller.findAll();

        // On vérifie que le mock a bien intercepté l'appel et retourné la fausse donnée
        expect(result).toHaveLength(1);
        expect(result[0].firstname).toEqual('Bruce');
    });
});
