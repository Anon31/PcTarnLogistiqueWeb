import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { RolesGuard } from '../../core/guards/roles.guard';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';
import { Role } from '@prisma/client';

@ApiTags('Véhicules')
@ApiBearerAuth()
// PROTECTION GLOBALE : Le JwtAuthGuard vérifie l'identité, le RolesGuard vérifie les droits.
// L'ordre est très important, car RolesGuard a besoin que le JWT ait décodé l'utilisateur en premier.
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Post()
    // AUTORISATION : Seule la hiérarchie logistique peut ajouter un véhicule à la flotte.
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Créer un véhicule' })
    @ApiResponse({ type: VehicleEntity, status: 201 })
    create(@Body() createVehicleDto: CreateVehicleDto) {
        return this.vehiclesService.create(createVehicleDto);
    }

    @Get()
    // ACCÈS PUBLIC (Connecté) : L'absence de @Roles() permet à n'importe quel rôle (dont BENEVOLE) d'appeler cette route.
    @ApiOperation({ summary: 'Récupérer la liste de tous les véhicules' })
    @ApiResponse({ type: [VehicleEntity], status: 200 })
    findAll() {
        return this.vehiclesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer un véhicule par son ID' })
    @ApiResponse({ type: VehicleEntity, status: 200 })
    // Le ParseIntPipe est une sécurité supplémentaire qui empêche les requêtes avec des lettres (ex: /vehicles/abc)
    // de toucher la base de données. NestJS renverra une erreur 400 automatiquement.
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.vehiclesService.findOne(id);
    }

    @Get(':id/bags')
    @ApiOperation({ summary: "Récupérer tous les sacs d'un véhicule par son ID" })
    async findAllVehicleBags(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.vehiclesService.findAllBags(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre à jour un véhicule par son ID' })
    @ApiResponse({ type: VehicleEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
        return this.vehiclesService.update(id, updateVehicleDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN) // Seul Admin peut supprimer une ressource lourde.
    @ApiOperation({ summary: 'Supprimer un véhicule par son ID' })
    @ApiResponse({ type: VehicleEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.vehiclesService.remove(id);
    }
}
