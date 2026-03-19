import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBagTemplateDto {
    @ApiProperty({ description: 'Nom unique du modele de sac', example: 'LOT B' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
