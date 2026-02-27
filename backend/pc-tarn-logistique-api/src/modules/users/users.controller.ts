import { Controller, Get, Post, Body, Request, Param, ParseIntPipe, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Utilisateurs') // Regroupe-les endpoints sous la section "Utilisateurs"
@ApiBearerAuth() // Indique à Swagger que l'utilisateur doit fournir un token JWT. Fait apparaître un cadenas dans l'UI.
@UseGuards(JwtAuthGuard) // Protège toutes les routes du controller (Sinon il faudrait le mettre sur chaque route)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Endpoint pour créer un nouvel utilisateur. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param createUserDto
     */
    @Post()
    @ApiOperation({ summary: `Création d'un utilisateur` })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    /**
     * Endpoint pour récupérer la liste de tous les utilisateurs. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     */
    @Get()
    @ApiOperation({ summary: 'Récupérer la liste de tous les utilisateurs' })
    findAll() {
        return this.usersService.findAll();
    }

    /**
     * Endpoint pour récupérer un utilisateur par son ID. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un utilisateur par son ID' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    /**
     * Endpoint pour mettre à jour un utilisateur par son ID. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param id
     * @param updateUserDto
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur par son ID' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    /**
     * Endpoint pour supprimer un utilisateur par son ID. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param id
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un utilisateur par son ID' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    /**
     * Endpoint pour que l'utilisateur connecté puisse mettre à jour son propre mot de passe.
     * @param req
     * @param updatePasswordDto
     */
    @Patch('me/password')
    @ApiOperation({ summary: "Mettre à jour le mot de passe de l'utilisateur connecté" })
    async updatePassword(@Request() req: any, @Body() updatePasswordDto: UpdatePasswordDto) {
        // Dans la stratégie JWT (jwt.strategy.ts), le 'sub' du payload a été remappé en 'userId'
        // C'est donc cette propriété que l'on doit utiliser pour récupérer l'ID de l'utilisateur
        return this.usersService.updatePassword(req.user.userId, updatePasswordDto);
    }
}
