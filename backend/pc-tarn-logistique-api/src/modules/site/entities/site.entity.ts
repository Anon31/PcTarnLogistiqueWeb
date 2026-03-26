import { BagTemplateEntity } from '../../bag/bag-template/entities/bag-template.entity';
import { Site, SiteType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

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

    // 1ère CORRECTION : On autorise le "null" car un site INDOOR n'a pas de sac
    @ApiProperty({
        required: false,
        nullable: true,
        description: 'ID du modèle de sac si le site est de type OUTDOOR',
    })
    bagTemplateId: number | null;

    // 2ème CORRECTION : On ajoute l'objet complet bagTemplate pour le service
    @ApiProperty({
        required: false,
        type: () => BagTemplateEntity,
        description: 'Le modèle théorique du sac lié à ce site',
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

    constructor(partial: Partial<SiteEntity>) {
        Object.assign(this, partial);
    }
}
