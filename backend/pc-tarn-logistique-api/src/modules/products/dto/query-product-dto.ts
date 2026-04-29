import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryProductDto {
    @ApiPropertyOptional({
        description: 'Identifiant du site pour filtrer les produits par stock',
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    siteId?: number;
}
