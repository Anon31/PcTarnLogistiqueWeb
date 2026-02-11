import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

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

    it('should be defined', () => {
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
                roles: 'BENEVOLE', // Champ requis par le DTO
            };

            // MOCK PRISMA
            // Note importante sur le typage :
            // Par défaut, le type de retour de 'create' est l'objet 'User' simple (sans relations).
            // Or, notre vrai code utilise 'include: { roles: true }', donc il retourne un objet plus riche.
            // TypeScript signale une erreur car 'roles' n'existe pas sur le type 'User' de base.

            // @ts-ignore (mockDeep gère les types complexes de Prisma)
            prismaMock.user.create.mockResolvedValue({
                id: 1,
                ...dto, // Copie les champs simples
                password: 'hashed_password',
                // On simule le retour de "include" (Tableau d'objets)
                roles: [{ id: 1, name: 'BENEVOLE' }],
                createdAt: new Date(),
                updatedAt: new Date(),
                enabled: true,
                phone: null,
                birthdate: null,
                address: null,
            } as any); // L'ASTUCE EST ICI :
            // L'utilisation de 'as any' dit à TypeScript : "Fais-moi confiance, l'objet retourné
            // contient bien des propriétés supplémentaires (comme roles) qui ne sont pas dans le type User strict."
            // C'est nécessaire pour mocker les requêtes avec 'include' ou 'select'.

            // ACTION
            const result = await service.create(dto);

            // ASSERTION
            expect(prismaMock.user.create).toHaveBeenCalled();
            expect(result).not.toHaveProperty('password');
            expect(result.email).toEqual(dto.email);
            // On vérifie que le service a bien reçu le tableau de rôles du mock
            expect(result.roles[0].name).toEqual('BENEVOLE');
        });

        /** TEST DES ERREURS */
        it("doit renvoyer une erreur si l'email existe déjà", async () => {
            const dto = {
                email: 'exist@test.com',
                password: '123',
                firstname: 'A',
                lastname: 'B',
                roles: 'USER',
            };

            // On simule une erreur de type "email déjà utilisé" (code P2002 de Prisma)
            prismaMock.user.create.mockRejectedValue({
                code: 'P2002',
            });

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    /**
     * TEST DE LA FONCTION FIND ONE
     */
    describe('findOne', () => {
        it("doit retourner un utilisateur si l'ID existe", async () => {
            const mockUser = { id: 1, email: 'test@test.com' };
            // On utilise aussi 'as any' si besoin pour findUnique si on a des includes
            prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
        });
    });
});
