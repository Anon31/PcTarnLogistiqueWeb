import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BagTemplateSiteService } from './bag-template-site.service';
import { CreateBagTemplateSiteDto } from './dto/create-bag-template-site.dto';
import { UpdateBagTemplateSiteDto } from './dto/update-bag-template-site.dto';
import { BagTemplateSiteEntity } from './entities/bag-template-site.entity';

/**
 * Controleur REST dedie aux liens entre les sites et les modeles de sac.
 * Il expose les operations CRUD necessaires a l'affectation des modeles aux sites.
 */
@ApiTags('Bag Template Sites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bag-template-sites')
export class BagTemplateSiteController {
    constructor(private readonly bagTemplateSiteService: BagTemplateSiteService) {}

    /**
     * Cree une association entre un site et un modele de sac.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param createBagTemplateSiteDto Donnees de creation du lien site/modele.
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Creer un lien entre un site et un modele de sac' })
    @ApiResponse({ type: BagTemplateSiteEntity, status: 201 })
    create(@Body() createBagTemplateSiteDto: CreateBagTemplateSiteDto) {
        return this.bagTemplateSiteService.create(createBagTemplateSiteDto);
    }

    /**
     * Recupere toutes les associations entre sites et modeles de sac.
     */
    @Get()
    @ApiOperation({ summary: 'Recuperer la liste des liens site/modele de sac' })
    @ApiResponse({ type: [BagTemplateSiteEntity], status: 200 })
    findAll() {
        return this.bagTemplateSiteService.findAll();
    }

    /**
     * Recupere une association site/modele de sac a partir de son identifiant.
     * @param id Identifiant du lien recherche.
     */
    @Get(':id')
    @ApiOperation({ summary: 'Recuperer un lien site/modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateSiteEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateSiteService.findOne(id);
    }

    /**
     * Met a jour une association existante entre un site et un modele de sac.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du lien a modifier.
     * @param updateBagTemplateSiteDto Donnees de mise a jour du lien.
     */
    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre a jour un lien site/modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateSiteEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBagTemplateSiteDto: UpdateBagTemplateSiteDto) {
        return this.bagTemplateSiteService.update(id, updateBagTemplateSiteDto);
    }

    /**
     * Supprime une association site/modele de sac.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du lien a supprimer.
     */
    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Supprimer un lien site/modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateSiteEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateSiteService.remove(id);
    }
}
