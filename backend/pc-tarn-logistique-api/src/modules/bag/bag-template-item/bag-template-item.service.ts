import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateItemDto } from './dto/create-bag-template-item.dto';
import { UpdateBagTemplateItemDto } from './dto/update-bag-template-item.dto';
import { BagTemplateItemEntity } from './entities/bag-template-item.entity';

const bagTemplateItemRelations = {
    bagTemplate: true,
    product: true,
} satisfies Prisma.BagTemplateItemInclude;

type BagTemplateItemWithRelations = Prisma.BagTemplateItemGetPayload<{
    include: typeof bagTemplateItemRelations;
}>;

/**
 * Service metier charge de la gestion des articles theoriques des modeles de sac.
 * Il pilote les acces Prisma et normalise les donnees renvoyees par l'API.
 */
@Injectable()
export class BagTemplateItemService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Cree un nouvel article theorique et charge ses relations associees.
     * @param dto Donnees de creation de l'article theorique.
     */
    async create(dto: CreateBagTemplateItemDto) {
        const bagTemplateItem = await this.prisma.bagTemplateItem.create({
            data: dto,
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    /**
     * Recupere tous les articles theoriques, tries par identifiant croissant.
     */
    async findAll() {
        const bagTemplateItems = await this.prisma.bagTemplateItem.findMany({
            include: bagTemplateItemRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplateItems.map((bagTemplateItem) => this.toEntity(bagTemplateItem));
    }

    /**
     * Recherche un article theorique par son identifiant.
     * Une exception est levee si aucun enregistrement ne correspond.
     * @param id Identifiant de l'article theorique recherche.
     */
    async findOne(id: number) {
        const bagTemplateItem = await this.prisma.bagTemplateItem.findUnique({
            where: { id },
            include: bagTemplateItemRelations,
        });

        if (!bagTemplateItem) throw new NotFoundException(`BagTemplateItem #${id} introuvable`);

        return this.toEntity(bagTemplateItem);
    }

    /**
     * Met a jour un article theorique existant apres verification de son existence.
     * @param id Identifiant de l'article theorique a modifier.
     * @param dto Donnees de mise a jour.
     */
    async update(id: number, dto: UpdateBagTemplateItemDto) {
        await this.findOne(id);

        const bagTemplateItem = await this.prisma.bagTemplateItem.update({
            where: { id },
            data: dto,
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    /**
     * Supprime un article theorique apres verification de son existence.
     * @param id Identifiant de l'article theorique a supprimer.
     */
    async remove(id: number) {
        await this.findOne(id);

        const bagTemplateItem = await this.prisma.bagTemplateItem.delete({
            where: { id },
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    /**
     * Transforme le resultat Prisma en entite API.
     * @param bagTemplateItem Article theorique charge avec ses relations.
     */
    private toEntity(bagTemplateItem: BagTemplateItemWithRelations) {
        return new BagTemplateItemEntity(bagTemplateItem);
    }
}
