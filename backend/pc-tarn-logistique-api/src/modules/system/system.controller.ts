import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SystemService } from './system.service';

@ApiTags('Système & Métadonnées')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('system') //
export class SystemController {
    constructor(private readonly systemService: SystemService) {}

    @Get('reference-data')
    @ApiOperation({ summary: 'Récupérer tous les dictionnaires de référence (enums) pour le frontend' })
    @HttpCode(HttpStatus.OK)
    getReferenceData() {
        return this.systemService.getReferenceData();
    }
}
