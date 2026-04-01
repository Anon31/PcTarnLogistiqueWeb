import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProductBatchNumberDto } from './dto/create-product-batch-number.dto';
import { UpdateProductBatchNumberDto } from './dto/update-product-batch-number.dto';
import { ProductBatchNumberEntity } from './entities/product-batch-number.entity';
import { ProductBatchNumberService } from './product-batch-number.service';

/**
 * Controleur REST dedie a la gestion des lots de fabrication produit.
 * Il expose les operations CRUD securisees sur les lots.
 */
@ApiTags('Product Batch Numbers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product-batch-numbers')
export class ProductBatchNumberController {
    constructor(private readonly productBatchNumberService: ProductBatchNumberService) {}

    /**
     * Cree un nouveau lot de fabrication produit.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param createProductBatchNumberDto Donnees de creation du lot.
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Creer un lot de fabrication produit' })
    @ApiResponse({ type: ProductBatchNumberEntity, status: 201 })
    create(@Body() createProductBatchNumberDto: CreateProductBatchNumberDto) {
        return this.productBatchNumberService.create(createProductBatchNumberDto);
    }

    /**
     * Recupere la liste complete des lots de fabrication produit.
     * Les resultats incluent les relations utiles a la consultation.
     */
    @Get()
    @ApiOperation({ summary: 'Recuperer la liste des lots de fabrication produit' })
    @ApiResponse({ type: [ProductBatchNumberEntity], status: 200 })
    findAll() {
        return this.productBatchNumberService.findAll();
    }

    /**
     * Recupere un lot de fabrication produit a partir de son identifiant.
     * @param id Identifiant du lot recherche.
     */
    @Get(':id')
    @ApiOperation({ summary: 'Recuperer un lot de fabrication produit par son ID' })
    @ApiResponse({ type: ProductBatchNumberEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productBatchNumberService.findOne(id);
    }

    /**
     * Met a jour un lot de fabrication produit existant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du lot a modifier.
     * @param updateProductBatchNumberDto Donnees de mise a jour.
     */
    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre a jour un lot de fabrication produit par son ID' })
    @ApiResponse({ type: ProductBatchNumberEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductBatchNumberDto: UpdateProductBatchNumberDto) {
        return this.productBatchNumberService.update(id, updateProductBatchNumberDto);
    }

    /**
     * Supprime un lot de fabrication produit par son identifiant.
     * Cette operation est reservee aux administrateurs et aux managers.
     * @param id Identifiant du lot a supprimer.
     */
    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Supprimer un lot de fabrication produit par son ID' })
    @ApiResponse({ type: ProductBatchNumberEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productBatchNumberService.remove(id);
    }
}
