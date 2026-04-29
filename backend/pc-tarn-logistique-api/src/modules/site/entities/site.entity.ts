import { ApiProperty } from '@nestjs/swagger';
import { Site, SiteType } from '@prisma/client';
import { BagTemplateEntity } from '../../bag/bag-template/entities/bag-template.entity';

/**
 * Entite de sortie representant un site expose par l'API.
 * Elle peut embarquer le modele de sac theorique et l'adresse associee.
 */
export class SiteEntity implements Site {
    @ApiProperty({ description: 'Identifiant unique du site', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nom du site', example: "Antenne d'Albi" })
    name: string;

    @ApiProperty({
        enum: SiteType,
        description: 'Type du site',
        example: SiteType.INDOOR,
    })
    type: SiteType;

    @ApiProperty({ description: 'Code unique du site', example: 'ALB' })
    code: string;

    @ApiProperty({
        required: false,
        nullable: true,
        description: 'Identifiant du modele de sac si le site est de type OUTDOOR',
    })
    bagTemplateId: number | null;

    @ApiProperty({
        required: false,
        type: () => BagTemplateEntity,
        description: 'Le modele theorique du sac lie a ce site',
    })
    bagTemplate?: BagTemplateEntity;

    @ApiProperty({
        required: false,
        type: Object,
        description: 'Adresse associee au site',
    })
    address?: {
        id: number;
        number: number;
        street: string;
        city: string;
        zipcode: string;
        state: string;
        userId: number | null;
        siteId: number | null;
    } | null;
    bagchecks?: {
        id: number;
        date: Date;
        userId: number;
        siteId: number;
    }[] | null;
    /**
     * Construit une entite a partir d'un objet partiel.
     * @param partial Donnees a affecter a l'entite.
     */
    constructor(partial: Partial<SiteEntity>) {
        Object.assign(this, partial);
    }
}
