import { ApiProperty } from '@nestjs/swagger';
import { BatchStatus } from '@prisma/client';

export class ProductBatchSummaryEntity {
    @ApiProperty({ description: 'Identifiant du produit parent', example: 2 })
    id: number;

    @ApiProperty({ description: 'Nom du produit', example: 'Compresse sterile' })
    name: string;

    @ApiProperty({ description: 'Numero du lot', example: 'REF2026' })
    number: string;

    @ApiProperty({
        description: 'Date de peremption du lot',
        example: '2024-12-31T00:00:00.000Z',
        nullable: true,
        required: false,
    })
    expiryDate: Date | null;

    @ApiProperty({
        enum: BatchStatus,
        description: 'Statut du lot',
        example: BatchStatus.VALID,
    })
    status: BatchStatus;

    @ApiProperty({
        description: 'Quantite disponible pour ce lot sur le site selectionne',
        example: 40,
    })
    quantity: number;

    constructor(partial: Partial<ProductBatchSummaryEntity>) {
        Object.assign(this, partial);
    }
}
