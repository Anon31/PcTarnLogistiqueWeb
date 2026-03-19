import { ApiProperty } from '@nestjs/swagger';
import { BagTemplate } from '@prisma/client';

export class BagTemplateEntity implements BagTemplate {
    @ApiProperty({ description: 'Identifiant unique du modele de sac', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nom unique du modele de sac', example: 'LOT B' })
    name: string;

    @ApiProperty({
        required: false,
        isArray: true,
        type: Object,
        description: 'Articles theoriques rattaches au modele de sac',
    })
    items?: Array<{
        id: number;
        expectedQuantity: number;
        bagTemplateId: number;
        productId: number;
        product?: {
            id: number;
            name: string;
            category: string;
            minThreshold: number;
            isPerishable: boolean;
        };
    }>;

    constructor(partial: Partial<BagTemplateEntity>) {
        Object.assign(this, partial);
    }
}
