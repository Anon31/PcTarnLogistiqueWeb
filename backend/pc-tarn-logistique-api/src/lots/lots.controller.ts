import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un lot' })
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recuperer la liste de tous les lots' })
  findAll() {
    return this.lotsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer un lot par son ID' })
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre a jour un lot par son ID' })
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotsService.update(+id, updateLotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un lot par son ID' })
  remove(@Param('id') id: string) {
    return this.lotsService.remove(+id);
  }
}
