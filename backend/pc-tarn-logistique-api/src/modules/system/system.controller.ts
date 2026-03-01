import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';

@ApiTags('Système & Métadonnées')
@Controller('system')
export class SystemController {
    constructor(private readonly systemService: SystemService) {}

    @Get('reference-data')
    @ApiOperation({ summary: 'Récupérer tous les dictionnaires de référence (enums) pour le frontend' })
    @HttpCode(HttpStatus.OK)
    getReferenceData() {
        return this.systemService.getReferenceData();
    }
}
