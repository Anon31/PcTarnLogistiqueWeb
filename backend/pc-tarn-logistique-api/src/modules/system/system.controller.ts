import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemService } from './system.service';

@ApiTags('Système & Métadonnées')
@Controller('system')
export class SystemController {
    constructor(private readonly systemService: SystemService) {}

    /**
     * Récupérer le statut global du système et de sa sécurité
     * Permet de vérifier si le backend a bien démarré avec les secrets Vault.
     */
    @Get('status')
    @ApiOperation({ summary: 'Récupérer le statut global du système et de sa sécurité' })
    @HttpCode(HttpStatus.OK)
    getSystemStatus() {
        return this.systemService.getSystemStatus();
    }

    /**
     * Récupérer tous les dictionnaires de référence (enums) pour le frontend
     * Ce point de terminaison fournit une structure complète de tous les enums utilisés dans l'application,
     * permettant au frontend de les consommer facilement pour les formulaires, les filtres, etc.
     * @returns Un objet contenant tous les enums de référence
     */
    @Get('reference-data')
    @ApiOperation({ summary: 'Récupérer tous les dictionnaires de référence (enums) pour le frontend' })
    @HttpCode(HttpStatus.OK)
    getReferenceData() {
        return this.systemService.getReferenceData();
    }
}
