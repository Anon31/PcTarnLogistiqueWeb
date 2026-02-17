import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// 1. On mock le module bcrypt globalement pour éviter les erreurs de redéfinition (Cannot redefine property)
jest.mock('bcrypt');

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: Partial<UsersService>;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        // Mocks simples pour les dépendances
        usersService = {
            findByEmail: jest.fn(),
        };
        jwtService = {
            signAsync: jest.fn().mockResolvedValue('fake_token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: usersService }, { provide: JwtService, useValue: jwtService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    describe('login', () => {
        it('doit retourner un token si les identifiants sont valides', async () => {
            // ARRANGEMENT
            const loginDto = { email: 'valid@test.com', password: 'good_password' };
            const mockUser = {
                id: 1,
                email: 'valid@test.com',
                password: 'hashed_password',
                enabled: true,
                roles: [{ name: 'USER' }],
                firstname: 'John',
                lastname: 'Doe',
            };

            (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

            // On configure la réponse du mock bcrypt (déjà mocké par jest.mock en haut)
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            // ACTION
            const result = await authService.login(loginDto);

            // ASSERTION
            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toEqual('fake_token');
            expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
        });

        it('doit échouer si le mot de passe est incorrect', async () => {
            const loginDto = { email: 'valid@test.com', password: 'wrong_password' };
            const mockUser = {
                id: 1,
                email: 'valid@test.com',
                password: 'hashed_password',
                enabled: true,
                roles: [],
            };

            (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            // On configure bcrypt pour renvoyer false
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('doit échouer si le compte est désactivé', async () => {
            const loginDto = { email: 'disabled@test.com', password: 'any' };
            const mockUser = { enabled: false }; // User désactivé

            (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

            await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
            // Pour faire échouer le test, on peut aussi vérifier que le message d'erreur est correct
            // await expect(authService.login(loginDto)).resolves.not.toThrow();
        });
    });
});
