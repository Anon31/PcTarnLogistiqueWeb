import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnumsService } from './enums.service';

@ApiTags('Système')
@Controller('enums')
export class EnumsController {
    constructor(private readonly enumsService: EnumsService) {}

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les énumérations' })
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.enumsService.getEnums();
    }
}
