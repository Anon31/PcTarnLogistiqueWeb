import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BagCompositionsService } from './bag-compositions.service';
import { CreateBagCompositionDto } from './dto/create-bag-composition.dto';
import { UpdateBagCompositionDto } from './dto/update-bag-composition.dto';

@ApiTags('BagCompositions')
@Controller('bag-compositions')
export class BagCompositionsController {
  constructor(private readonly bagCompositionsService: BagCompositionsService) {}

  @Post()
  @ApiOperation({ summary: 'Creer une bagComposition' })
  create(@Body() createBagCompositionDto: CreateBagCompositionDto) {
    return this.bagCompositionsService.create(createBagCompositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recuperer la liste de toutes les bagCompositions' })
  findAll() {
    return this.bagCompositionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recuperer une bagComposition par son ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bagCompositionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre a jour une bagComposition par son ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBagCompositionDto: UpdateBagCompositionDto,
  ) {
    return this.bagCompositionsService.update(id, updateBagCompositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une bagComposition par son ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bagCompositionsService.remove(id);
  }
}
