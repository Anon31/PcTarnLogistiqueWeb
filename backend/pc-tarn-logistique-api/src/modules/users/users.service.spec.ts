import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { CreateAddressDto } from '../../shared/dto/create-address.dto';

describe('UsersService', () => {
    let service: UsersService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                providePrismaMock(), // Injection du Mock Prisma centralisé
            ],
        }).compile();
        service = module.get<UsersService>(UsersService);
        prismaMock = module.get(PrismaService);
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });

    /**
     * TEST DE LA FONCTION CREATE
     */
    describe('create', () => {
        it('doit créer un utilisateur avec un mot de passe hashé', async () => {
            // On inclut 'roles' car il est obligatoire dans CreateUserDto
            const dto = {
                email: 'test@test.com',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe',
                role: Role.BENEVOLE, // Champ requis par le DTO
                birthdate: '1990-03-15',
                siteId: 2,
            };

            // @ts-expect-error (mockDeep gère les types complexes de Prisma)
            prismaMock.user.create.mockResolvedValue({
                id: 1,
                ...dto, // Copie les champs simples
                password: 'hashed_password',
                siteId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
                enabled: true,
                phone: '0612345678',
                birthdate: '1990-03-15',
                address: CreateAddressDto,
            } as any);

            // ACTION
            const result = await service.create(dto);

            // ASSERTION
            expect(prismaMock.user.create).toHaveBeenCalled();

            // CORRECTION ICI : Le décorateur @Exclude() n'agit qu'au niveau du Contrôleur (via l'intercepteur).
            // Au niveau du Service, l'entité contient toujours le mot de passe hashé retourné par Prisma.
            expect(result.password).toEqual('hashed_password');

            expect(result.email).toEqual(dto.email);
            // On vérifie que le service a bien reçu le tableau de rôles du mock
            expect(result.role).toEqual('BENEVOLE');
        });

        /** TEST DES ERREURS */
        it("doit laisser remonter l'erreur native Prisma si l'email existe déjà", async () => {
            const dto = {
                email: 'exist@test.com',
                password: '123',
                firstname: 'A',
                lastname: 'B',
                role: Role.BENEVOLE,
                birthdate: '1990-03-15',
                siteId: 2,
            };

            // 1. On crée un vrai objet Error (pour que Jest puisse le vérifier avec .toThrow)
            class MockPrismaError extends Error {
                code = 'P2002';
            }
            const error = new MockPrismaError('Unique constraint failed');

            // 2. On simule le crash de Prisma
            prismaMock.user.create.mockRejectedValue(error);

            // 3. Le Service N'EST PLUS CENSÉ lever une ConflictException (c'est le rôle du Filtre Global).
            // Il doit simplement laisser passer l'erreur Prisma.
            await expect(service.create(dto)).rejects.toThrow(MockPrismaError);
        });
    });
});
