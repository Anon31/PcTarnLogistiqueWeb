import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Role } from '@prisma/client';

@ApiTags('Produits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Les deux Guards sont toujours appliqués l'un après l'autre au niveau du contrôleur
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    /**
     * Créer un nouveau produit médical. Seuls les utilisateurs ayant le rôle d'Admin ou de Manager peuvent effectuer cette opération.
     * @param createProductDto
     */
    @Post()
    @Roles(Role.ADMIN, Role.MANAGER) // Seuls les Admins et Managers peuvent créer
    @ApiOperation({ summary: 'Créer un produit médical' })
    @ApiResponse({ type: ProductEntity, status: 201 })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    /**
     * Récupérer la liste de tous les produits. Cette opération est ouverte à tous les utilisateurs authentifiés.
     */
    @Get()
    @ApiOperation({ summary: 'Récupérer la liste de tous les produits' })
    @ApiResponse({ type: [ProductEntity], status: 200 })
    findAll() {
        return this.productsService.findAll();
    }

    /**
     * Récupérer un produit par son ID. Cette opération est ouverte à tous les utilisateurs authentifiés.
     * @param id
     */
    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un produit par son ID' })
    @ApiResponse({ type: ProductEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    /**
     * Mettre à jour un produit par son ID. Seuls les Admins et Managers ont le droit de modifier les produits
     * @param id
     * @param updateProductDto
     */
    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER) // Protection de la modification
    @ApiOperation({ summary: 'Mettre à jour un produit par son ID' })
    @ApiResponse({ type: ProductEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    /**
     * Supprimer un produit par son ID. Cette opération est très sensible,
     * c'est pourquoi elle est strictement réservée aux Admins.
     * @param id
     */
    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Supprimer un produit par son ID' })
    @ApiResponse({ type: ProductEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}
