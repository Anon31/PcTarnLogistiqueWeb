import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Res, ParseIntPipe} from '@nestjs/common';
import { VehiculesService } from './vehicules.service';
import { CreateVehiculeDto } from './dto/create-vehicule.dto';
import { UpdateVehiculeDto } from './dto/update-vehicule.dto';
import {Response} from 'express';
import { ApiOperation } from '@nestjs/swagger';
@Controller('vehicules')
export class VehiculesController {
  constructor(private readonly vehiculesService: VehiculesService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un vehicule' })
  create(@Body() createVehiculeDto: CreateVehiculeDto) {
    return this.vehiculesService.create(createVehiculeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recuperer la liste de tous les vehicules' })
  findAll() {
    return this.vehiculesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer un vehicule par son ID' })
  findOne(@Param('id') id: string) {
    return this.vehiculesService.findOne(+id);
  }

  @Get(':id/lots')
  @ApiOperation({ summary: "Recuperer tous les lots d'un vehicule par son ID" })
  async findAllVehiculeLots(@Param('id',ParseIntPipe) id:number):Promise<any>{
    return this.vehiculesService.findAlllots(id)
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre a jour un vehicule par son ID' })
  update(@Param('id') id: string, @Body() updateVehiculeDto: UpdateVehiculeDto) {
    return this.vehiculesService.update(+id, updateVehiculeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un vehicule par son ID' })
  remove(@Param('id') id: string) {
    return this.vehiculesService.remove(+id);
  }
  
}
