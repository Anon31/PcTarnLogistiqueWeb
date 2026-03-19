import { ApiProperty } from '@nestjs/swagger';
import { BagTemplateItem } from '@prisma/client';

export class BagTemplateItemEntity implements BagTemplateItem {
    @ApiProperty({ description: "Identifiant unique de l'article theorique", example: 1 })
    id: number;

    @ApiProperty({
        description: 'Quantite theorique attendue pour le produit',
        example: 6,
        minimum: 0,
    })
    expectedQuantity: number;

    @ApiProperty({ description: 'Identifiant du modele de sac rattache', example: 1 })
    bagTemplateId: number;

    @ApiProperty({ description: 'Identifiant du produit rattache', example: 3 })
    productId: number;

    @ApiProperty({
        required: false,
        type: Object,
        description: 'Modele de sac rattache',
    })
    bagTemplate?: {
        id: number;
        name: string;
    };

    @ApiProperty({
        required: false,
        type: Object,
        description: 'Produit rattache',
    })
    product?: {
        id: number;
        name: string;
        category: string;
        minThreshold: number;
        isPerishable: boolean;
    };

    constructor(partial: Partial<BagTemplateItemEntity>) {
        Object.assign(this, partial);
    }
}
