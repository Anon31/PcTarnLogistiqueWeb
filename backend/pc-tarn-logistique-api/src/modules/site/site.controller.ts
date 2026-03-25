import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';

@ApiTags('Sites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sites')
export class SiteController {
    constructor(private readonly siteService: SiteService) {}

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Creer un site' })
    @ApiResponse({ type: SiteEntity, status: 201 })
    create(@Body() createSiteDto: CreateSiteDto) {
        return this.siteService.create(createSiteDto);
    }
    
    @Get()
    @ApiOperation({ summary: 'Recuperer la liste de tous les sites' })
    @ApiResponse({ type: [SiteEntity], status: 200 })
    findAll() {
        return this.siteService.findAll();
    }
    
    @Get('type/outdoors')
    @ApiOperation({ summary: 'Recuperer tous les sites outdoors(bags)' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    FindOutDoors() {
        return this.siteService.findAllOutDoors();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Recuperer un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.siteService.findOne(id);
    }
    

    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre a jour un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSiteDto: UpdateSiteDto) {
        return this.siteService.update(id, updateSiteDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Supprimer un site par son ID' })
    @ApiResponse({ type: SiteEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.siteService.remove(id);
    }
}
