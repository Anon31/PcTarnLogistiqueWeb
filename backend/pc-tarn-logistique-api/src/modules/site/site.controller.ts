import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProductEntity } from '../products/entities/product.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';
import { SiteService } from './site.service';

/**
 * Controleur REST dedie a la gestion des sites logistiques.
 * Il expose les operations CRUD ainsi que les routes specifiques aux sites outdoor.
 */
@ApiTags('Sites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sites')
export class SiteController {
    constructor(private readonly siteService: SiteService) {}

    /**
     * Cree un nouveau site.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param createSiteDto Donnees de creation du site.
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Creer un site' })
    @ApiResponse({ type: SiteEntity, status: 201 })
    create(@Body() createSiteDto: CreateSiteDto) {
        return this.siteService.create(createSiteDto);
    }

    /**
     * Recupere la liste de tous les sites.
     */
    @Get()
    @ApiOperation({ summary: 'Recuperer la liste de tous les sites' })
    @ApiResponse({ type: [SiteEntity], status: 200 })
    findAll() {
        return this.siteService.findAll();
    }

    /**
     * Recupere les produits attendus dans le sac theorique d'un site outdoor.
     * @param id Identifiant du site outdoor.
     */
    @Get('outdoors/:id/bag-items')
    @ApiOperation({ summary: 'Recuperer les produits attendus pour un site outdoor' })
    @ApiResponse({ type: [ProductEntity], status: 200 })
    findBagItems(@Param('id', ParseIntPipe) id: number) {
        return this.siteService.findAllExpectedOutdoorItems(id);
    }

    /**
     * Recupere la liste des sites outdoor avec leur dernier controle de sac.
     */
    @Get('outdoors')
    @ApiOperation({ summary: 'Recuperer tous les sites outdoor' })
    @ApiResponse({ type: [SiteEntity], status: 200 })
    findAllOutDoors() {
        return this.siteService.findAllOutDoors();
    }

    /**
     * Recupere un site par son identifiant.
     * @param id Identifiant du site recherche.
     */
    @Get(':id')
    @ApiOperation({ summary: 'Recuperer un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.siteService.findOne(id);
    }

    /**
     * Met a jour un site existant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du site a modifier.
     * @param updateSiteDto Donnees de mise a jour.
     */
    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre a jour un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSiteDto: UpdateSiteDto) {
        return this.siteService.update(id, updateSiteDto);
    }

    /**
     * Supprime un site par son identifiant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du site a supprimer.
     */
    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Supprimer un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.siteService.remove(id);
    }
}
