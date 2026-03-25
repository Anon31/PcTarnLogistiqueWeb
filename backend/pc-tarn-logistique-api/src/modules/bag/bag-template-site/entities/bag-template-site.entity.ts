import { ApiProperty } from '@nestjs/swagger';
import { BagTemplateSite } from '@prisma/client';

export class BagTemplateSiteEntity implements BagTemplateSite {
    @ApiProperty({ description: "Identifiant unique du lien site/modele de sac", example: 1 })
    id: number;

    @ApiProperty({ description: 'Identifiant du site rattache', example: 1 })
    siteId: number;

    @ApiProperty({ description: 'Identifiant du modele de sac rattache', example: 2 })
    bagTemplateId: number;

    @ApiProperty({
        required: false,
        type: Object,
        description: 'Site rattache',
    })
    site?: {
        id: number;
        name: string;
        type: string;
        code: string;
    };

    @ApiProperty({
        required: false,
        type: Object,
        description: 'Modele de sac rattache',
    })
    bagTemplate?: {
        id: number;
        name: string;
    };

    constructor(partial: Partial<BagTemplateSiteEntity>) {
        Object.assign(this, partial);
    }
}
