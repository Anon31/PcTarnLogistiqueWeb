import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class QueryProductBatchDto {
    @ApiProperty({
        description: 'Identifiant du site pour recuperer les lots du produit',
        example: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    siteId: number;
}
