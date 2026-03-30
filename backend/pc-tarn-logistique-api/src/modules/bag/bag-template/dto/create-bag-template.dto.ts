import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO utilise pour creer un modele de sac.
 * Il decrit les donnees minimales attendues par l'API.
 */
export class CreateBagTemplateDto {
    @ApiProperty({ description: 'Nom unique du modele de sac', example: 'LOT B' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
