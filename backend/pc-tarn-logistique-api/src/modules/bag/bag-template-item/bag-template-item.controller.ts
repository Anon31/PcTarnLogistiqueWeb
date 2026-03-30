import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BagTemplateItemService } from './bag-template-item.service';
import { CreateBagTemplateItemDto } from './dto/create-bag-template-item.dto';
import { UpdateBagTemplateItemDto } from './dto/update-bag-template-item.dto';
import { BagTemplateItemEntity } from './entities/bag-template-item.entity';

/**
 * Controleur REST dedie aux articles theoriques composant un modele de sac.
 * Il permet de gerer les associations entre un modele et un produit attendu.
 */
@ApiTags('Bag Template Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bag-template-items')
export class BagTemplateItemController {
    constructor(private readonly bagTemplateItemService: BagTemplateItemService) {}

    /**
     * Cree un article theorique pour un modele de sac.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param createBagTemplateItemDto Donnees de creation de l'article theorique.
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "Creer un article theorique d'un modele de sac" })
    @ApiResponse({ type: BagTemplateItemEntity, status: 201 })
    create(@Body() createBagTemplateItemDto: CreateBagTemplateItemDto) {
        return this.bagTemplateItemService.create(createBagTemplateItemDto);
    }

    /**
     * Recupere tous les articles theoriques definis pour les modeles de sac.
     */
    @Get()
    @ApiOperation({ summary: 'Recuperer la liste des articles theoriques des modeles de sacs' })
    @ApiResponse({ type: [BagTemplateItemEntity], status: 200 })
    findAll() {
        return this.bagTemplateItemService.findAll();
    }

    /**
     * Recupere un article theorique via son identifiant.
     * @param id Identifiant de l'article theorique recherche.
     */
    @Get(':id')
    @ApiOperation({ summary: "Recuperer un article theorique d'un modele de sac par son ID" })
    @ApiResponse({ type: BagTemplateItemEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateItemService.findOne(id);
    }

    /**
     * Met a jour un article theorique existant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant de l'article theorique a modifier.
     * @param updateBagTemplateItemDto Donnees de mise a jour.
     */
    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "Mettre a jour un article theorique d'un modele de sac par son ID" })
    @ApiResponse({ type: BagTemplateItemEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBagTemplateItemDto: UpdateBagTemplateItemDto) {
        return this.bagTemplateItemService.update(id, updateBagTemplateItemDto);
    }

    /**
     * Supprime un article theorique par son identifiant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant de l'article theorique a supprimer.
     */
    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: "Supprimer un article theorique d'un modele de sac par son ID" })
    @ApiResponse({ type: BagTemplateItemEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateItemService.remove(id);
    }
}
