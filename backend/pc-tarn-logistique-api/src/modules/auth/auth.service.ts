import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Chercher l'utilisateur
        const user = await this.usersService.findByEmail(email);

        // 2. Vérifier existence + Mot de passe + Activé
        if (!user || !user.enabled || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Identifiants incorrects ou compte désactivé');
        }

        // 3. Créer le payload du token (C'est ICI que ça se passe pour le token décodé)
        const payload = {
            sub: user.id,
            email: user.email,
            roles: user.roles.map((r) => r.name),
            firstname: user.firstname,
            lastname: user.lastname,
        };

        // 4. Retourner Token + Info User + Message
        return {
            access_token: await this.jwtService.signAsync(payload),
            message: 'Connexion réussie',
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                roles: user.roles,
            },
        };
    }
}
