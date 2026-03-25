import { Role } from '@prisma/client';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BagTemplateService } from './bag-template.service';
import { CreateBagTemplateDto } from './dto/create-bag-template.dto';
import { UpdateBagTemplateDto } from './dto/update-bag-template.dto';
import { BagTemplateEntity } from './entities/bag-template.entity';

@ApiTags('Bag Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bag-templates')
export class BagTemplateController {
    constructor(private readonly bagTemplateService: BagTemplateService) {}

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Creer un modele de sac' })
    @ApiResponse({ type: BagTemplateEntity, status: 201 })
    create(@Body() createBagTemplateDto: CreateBagTemplateDto) {
        return this.bagTemplateService.create(createBagTemplateDto);
    }

    @Get()
    @ApiOperation({ summary: 'Recuperer la liste des modeles de sacs' })
    @ApiResponse({ type: [BagTemplateEntity], status: 200 })
    findAll() {
        return this.bagTemplateService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Recuperer un modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateEntity, status: 200 })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Mettre a jour un modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateEntity, status: 200 })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBagTemplateDto: UpdateBagTemplateDto) {
        return this.bagTemplateService.update(id, updateBagTemplateDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Supprimer un modele de sac par son ID' })
    @ApiResponse({ type: BagTemplateEntity, status: 200 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bagTemplateService.remove(id);
    }
}
