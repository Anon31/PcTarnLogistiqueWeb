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

        // Vérification de l'utilisateur
        const user = await this.usersService.findByEmail(email);

        // Vérification de l'existence, de l'activation et du mot de passe
        if (!user || !user.enabled || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Identifiants incorrects ou compte désactivé');
        }

        // Création du Payload JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        // 4. Réponse
        return {
            access_token: await this.jwtService.signAsync(payload),
            message: 'Connexion réussie 🎯',
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
            },
        };
    }
}
