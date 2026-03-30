import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * DTO utilise pour associer un modele de sac a un site.
 * Il transporte les identifiants necessaires a la creation du lien.
 */
export class CreateBagTemplateSiteDto {
    @ApiProperty({
        description: 'Identifiant du site rattache',
        example: 1,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    siteId: number;

    @ApiProperty({
        description: 'Identifiant du modele de sac rattache',
        example: 2,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    bagTemplateId: number;
}
