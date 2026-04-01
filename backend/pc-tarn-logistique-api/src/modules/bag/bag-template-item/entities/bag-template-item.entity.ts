import { ApiProperty } from '@nestjs/swagger';
import { BagTemplateItem } from '@prisma/client';

/**
 * Entite de sortie representant un article theorique rattache a un modele de sac.
 * Elle peut embarquer le modele de sac et le produit associes.
 */
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

    /**
     * Construit une entite a partir d'un objet partiel.
     * @param partial Donnees a affecter a l'entite.
     */
    constructor(partial: Partial<BagTemplateItemEntity>) {
        Object.assign(this, partial);
    }
}
