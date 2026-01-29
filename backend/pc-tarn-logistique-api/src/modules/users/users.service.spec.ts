import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException } from '@nestjs/common';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        // 1. Création du module de test
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                providePrismaMock(), // Utilisation du provider partagé : plus propre !
            ],
        }).compile();
        service = module.get<UsersService>(UsersService);
        prismaMock = module.get(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit créer un utilisateur avec un mot de passe hashé', async () => {
            // ARRANGEMENT (Données de test)
            const dto = {
                email: 'test@test.com',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe',
            };

            // On simule le comportement de Prisma
            // @ts-ignore (mockDeep gère les types complexes de Prisma)
            prismaMock.user.create.mockResolvedValue({
                id: 1,
                ...dto,
                password: 'hashed_password', // On simule que le mot de passe a été hashé
                createdAt: new Date(),
                updatedAt: new Date(),
                enabled: true,
                phone: null,
                birthDate: null,
            });

            // ACTION
            const result = await service.create(dto);

            // ASSERTION
            expect(prismaMock.user.create).toHaveBeenCalled(); // Vérifie que Prisma a été appelé
            expect(result).not.toHaveProperty('password'); // Vérifie qu'on ne retourne pas le mdp
            expect(result.email).toEqual(dto.email);
        });

        it("doit renvoyer une erreur si l'email existe déjà", async () => {
            const dto = { email: 'exist@test.com', password: '123', firstname: 'A', lastname: 'B' };

            // On simule une erreur Prisma P2002 (Unique constraint)
            prismaMock.user.create.mockRejectedValue({
                code: 'P2002',
            });

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findOne', () => {
        it("doit retourner un utilisateur si l'ID existe", async () => {
            const mockUser = { id: 1, email: 'test@test.com' };
            // @ts-ignore
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
        });
    });
});
