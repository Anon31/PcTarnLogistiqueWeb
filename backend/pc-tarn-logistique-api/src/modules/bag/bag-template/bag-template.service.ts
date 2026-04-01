import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateDto } from './dto/create-bag-template.dto';
import { UpdateBagTemplateDto } from './dto/update-bag-template.dto';
import { BagTemplateEntity } from './entities/bag-template.entity';

const bagTemplateRelations = {
    items: {
        include: {
            product: true,
        },
        orderBy: {
            id: 'asc',
        },
    },
} satisfies Prisma.BagTemplateInclude;

type BagTemplateWithRelations = Prisma.BagTemplateGetPayload<{
    include: typeof bagTemplateRelations;
}>;

/**
 * Service metier charge de la gestion des modeles de sac.
 * Il centralise l'acces aux donnees Prisma et la transformation en entites API.
 */
@Injectable()
export class BagTemplateService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Cree un nouveau modele de sac puis charge ses relations utiles.
     * @param dto Donnees de creation du modele de sac.
     */
    async create(dto: CreateBagTemplateDto) {
        const bagTemplate = await this.prisma.bagTemplate.create({
            data: dto,
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    /**
     * Recupere tous les modeles de sac, tries par identifiant croissant.
     */
    async findAll() {
        const bagTemplates = await this.prisma.bagTemplate.findMany({
            include: bagTemplateRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplates.map((bagTemplate) => this.toEntity(bagTemplate));
    }

    /**
     * Recherche un modele de sac par son identifiant.
     * Une exception est levee si aucun modele ne correspond.
     * @param id Identifiant du modele de sac recherche.
     */
    async findOne(id: number) {
        const bagTemplate = await this.prisma.bagTemplate.findUnique({
            where: { id },
            include: bagTemplateRelations,
        });

        if (!bagTemplate) throw new NotFoundException(`BagTemplate #${id} introuvable`);

        return this.toEntity(bagTemplate);
    }

    /**
     * Met a jour un modele de sac existant apres verification de son existence.
     * @param id Identifiant du modele de sac a modifier.
     * @param dto Donnees de mise a jour.
     */
    async update(id: number, dto: UpdateBagTemplateDto) {
        await this.findOne(id);

        const bagTemplate = await this.prisma.bagTemplate.update({
            where: { id },
            data: dto,
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    /**
     * Supprime un modele de sac apres verification de son existence.
     * @param id Identifiant du modele de sac a supprimer.
     */
    async remove(id: number) {
        await this.findOne(id);

        const bagTemplate = await this.prisma.bagTemplate.delete({
            where: { id },
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    /**
     * Transforme le resultat Prisma en entite API.
     * @param bagTemplate Modele de sac charge avec ses relations.
     */
    private toEntity(bagTemplate: BagTemplateWithRelations) {
        return new BagTemplateEntity(bagTemplate);
    }
}
