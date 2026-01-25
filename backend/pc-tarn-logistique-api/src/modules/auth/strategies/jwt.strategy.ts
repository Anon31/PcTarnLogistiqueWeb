import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error("La variable d'environnement JWT_SECRET n'est pas définie.");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    /**
     * Validate the JWT payload
     * @param payload
     */
    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            roles: payload.roles,
            firstname: payload.firstname,
            lastname: payload.lastname,
        };
    }
}
