import { Controller, Get, Post, Body, Request, Param, ParseIntPipe, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';

@ApiTags('Utilisateurs') // Regroupe-les endpoints sous la section "Utilisateurs"
@ApiBearerAuth() // Indique à Swagger que l'utilisateur doit fournir un token JWT. Fait apparaître un cadenas dans l'UI.
@UseGuards(JwtAuthGuard, RolesGuard) // 👈 Protection globale (Authentification + Autorisation)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Endpoint pour créer un nouvel utilisateur.
     * @param createUserDto
     */
    @Post()
    @Roles(Role.ADMIN) // 👈 Règle métier : Seul un Administrateur peut créer des comptes
    @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
    @ApiResponse({ type: UserEntity, status: 201 })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    /**
     * Endpoint pour récupérer la liste de tous les utilisateurs. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     */
    @Get()
    @Roles(Role.ADMIN, Role.MANAGER) // Les Managers peuvent voir la liste des équipes
    @ApiOperation({ summary: 'Récupérer la liste de tous les utilisateurs' })
    @ApiResponse({ type: [UserEntity], status: 200 })
    findAll() {
        return this.usersService.findAll();
    }

    /**
     * Endpoint pour récupérer un utilisateur par son ID.
     * @param id
     */
    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "Récupérer le profil d'un utilisateur par son ID" })
    @ApiResponse({ type: UserEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    /**
     * Endpoint pour mettre à jour un utilisateur par son ID. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param id
     * @param updateUserDto
     */
    @Patch(':id')
    @Roles(Role.ADMIN) // 👈 Seul un Admin peut modifier le compte de quelqu'un d'autre (ex: changer son rôle)
    @ApiOperation({ summary: "Mettre à jour le profil d'un utilisateur" })
    @ApiResponse({ type: UserEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    /**
     * Endpoint pour supprimer un utilisateur par son ID. Seuls les utilisateurs avec le rôle ADMIN peuvent effectuer cette action.
     * @param id
     */
    @Delete(':id')
    @Roles(Role.ADMIN) // 👈 Sécurité maximale
    @ApiOperation({ summary: 'Supprimer définitivement un compte utilisateur' })
    @ApiResponse({ type: UserEntity, status: 200 })
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
