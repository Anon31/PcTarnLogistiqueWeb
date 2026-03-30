import { ApiProperty } from '@nestjs/swagger';
import { BatchStatus, Condition, ItemCategory, ProductBatchNumber, SiteType, TypeMovement } from '@prisma/client';

/**
 * Entite de sortie representant un lot de fabrication produit expose par l'API.
 * Elle peut embarquer les stocks et les mouvements de stock associes.
 */
export class ProductBatchNumberEntity implements ProductBatchNumber {
    @ApiProperty({ description: 'Identifiant unique du lot', example: 1 })
    id: number;

    @ApiProperty({ description: 'Numero du lot de fabrication', example: 'LOT-COMP-2027-01' })
    number: string;

    @ApiProperty({
        description: 'Date de peremption du lot',
        example: '2027-01-31T00:00:00.000Z',
        nullable: true,
        required: false,
    })
    expiryDate: Date | null;

    @ApiProperty({
        enum: BatchStatus,
        description: 'Statut courant du lot',
        example: BatchStatus.VALID,
    })
    status: BatchStatus;

    @ApiProperty({
        required: false,
        isArray: true,
        type: Object,
        description: 'Stocks actuellement rattaches a ce lot',
    })
    stocks?: Array<{
        id: number;
        quantity: number;
        condition: Condition;
        productId: number;
        siteId: number | null;
        ProductBatchNumberId: number | null;
        product?: {
            id: number;
            name: string;
            category: ItemCategory;
            minThreshold: number;
            isPerishable: boolean;
        };
        site?: {
            id: number;
            name: string;
            type: SiteType;
            code: string;
        } | null;
    }>;

    @ApiProperty({
        required: false,
        isArray: true,
        type: Object,
        description: 'Mouvements de stock historises pour ce lot',
    })
    stockMovements?: Array<{
        id: number;
        type: TypeMovement;
        createdAt: Date;
        quantity: number;
        userId: number;
        productBatchNumberId: number | null;
        siteId: number;
        productId: number;
        product?: {
            id: number;
            name: string;
            category: ItemCategory;
            minThreshold: number;
            isPerishable: boolean;
        };
        site?: {
            id: number;
            name: string;
            type: SiteType;
            code: string;
        };
    }>;

    /**
     * Construit une entite a partir d'un objet partiel.
     * @param partial Donnees a affecter a l'entite.
     */
    constructor(partial: Partial<ProductBatchNumberEntity>) {
        Object.assign(this, partial);
    }
}
