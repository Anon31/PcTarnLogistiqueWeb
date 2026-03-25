import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

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
