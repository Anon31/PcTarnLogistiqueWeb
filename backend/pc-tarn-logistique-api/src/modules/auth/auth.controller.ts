import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification') // Regroupe-les endpoints sous la section "Authentification"
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: "Connexion de l'utilisateur" })
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Déconnexion de l'utilisateur" })
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async logout(@Request() req: any) {
        // Note : Le vrai logout se fait côté client en supprimant le token.
        // Ici, on peut logger l'action ou invalider un cache si besoin.
        return { message: 'Déconnexion réussie' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Récupérer le profil de l'utilisateur connecté" })
    @ApiBearerAuth()
    getProfile(@Request() req: any) {
        return req.user;
    }
}
