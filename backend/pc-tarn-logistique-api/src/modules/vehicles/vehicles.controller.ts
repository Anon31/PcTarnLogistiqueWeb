import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Res, ParseIntPipe} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {Response} from 'express';
import { ApiOperation } from '@nestjs/swagger';
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un vehicle' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recuperer la liste de tous les vehicles' })
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer un vehicle par son ID' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Get(':id/lots')
  @ApiOperation({ summary: "Recuperer tous les lots d'un vehicle par son ID" })
  async findAllVehicleLots(@Param('id',ParseIntPipe) id:number):Promise<any>{
    return this.vehiclesService.findAlllots(id)
  }
  
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre a jour un vehicle par son ID' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un vehicle par son ID' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
  
}
