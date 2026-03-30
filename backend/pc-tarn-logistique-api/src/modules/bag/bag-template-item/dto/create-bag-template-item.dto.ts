import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

/**
 * DTO utilise pour declarer un produit attendu dans un modele de sac.
 * Il porte la quantite theorique ainsi que les references du modele et du produit.
 */
export class CreateBagTemplateItemDto {
    @ApiProperty({
        description: 'Quantite theorique attendue pour le produit',
        example: 6,
        minimum: 0,
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    expectedQuantity: number;

    @ApiProperty({
        description: 'Identifiant du modele de sac rattache',
        example: 1,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    bagTemplateId: number;

    @ApiProperty({
        description: 'Identifiant du produit rattache',
        example: 3,
        minimum: 1,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    productId: number;
}
