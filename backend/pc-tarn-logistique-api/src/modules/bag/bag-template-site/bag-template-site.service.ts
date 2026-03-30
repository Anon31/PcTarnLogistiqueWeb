import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateSiteDto } from './dto/create-bag-template-site.dto';
import { UpdateBagTemplateSiteDto } from './dto/update-bag-template-site.dto';
import { BagTemplateSiteEntity } from './entities/bag-template-site.entity';

const bagTemplateSiteRelations = {
    site: true,
    bagTemplate: true,
} satisfies Prisma.BagTemplateSiteInclude;

type BagTemplateSiteWithRelations = Prisma.BagTemplateSiteGetPayload<{
    include: typeof bagTemplateSiteRelations;
}>;

/**
 * Service metier charge de la gestion des associations entre sites et modeles de sac.
 * Il orchestre les operations Prisma et la conversion vers les entites de reponse.
 */
@Injectable()
export class BagTemplateSiteService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Cree une nouvelle association entre un site et un modele de sac.
     * @param dto Donnees de creation de l'association.
     */
    async create(dto: CreateBagTemplateSiteDto) {
        const bagTemplateSite = await this.prisma.bagTemplateSite.create({
            data: dto,
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    /**
     * Recupere toutes les associations site/modele de sac, triees par identifiant.
     */
    async findAll() {
        const bagTemplateSites = await this.prisma.bagTemplateSite.findMany({
            include: bagTemplateSiteRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplateSites.map((bagTemplateSite) => this.toEntity(bagTemplateSite));
    }

    /**
     * Recherche une association site/modele de sac par son identifiant.
     * Une exception est levee si aucun lien ne correspond.
     * @param id Identifiant du lien recherche.
     */
    async findOne(id: number) {
        const bagTemplateSite = await this.prisma.bagTemplateSite.findUnique({
            where: { id },
            include: bagTemplateSiteRelations,
        });

        if (!bagTemplateSite) throw new NotFoundException(`BagTemplateSite #${id} introuvable`);

        return this.toEntity(bagTemplateSite);
    }

    /**
     * Met a jour une association existante apres verification de son existence.
     * @param id Identifiant du lien a modifier.
     * @param dto Donnees de mise a jour.
     */
    async update(id: number, dto: UpdateBagTemplateSiteDto) {
        await this.findOne(id);

        const bagTemplateSite = await this.prisma.bagTemplateSite.update({
            where: { id },
            data: dto,
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    /**
     * Supprime une association site/modele de sac apres verification de son existence.
     * @param id Identifiant du lien a supprimer.
     */
    async remove(id: number) {
        await this.findOne(id);

        const bagTemplateSite = await this.prisma.bagTemplateSite.delete({
            where: { id },
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    /**
     * Transforme le resultat Prisma en entite API.
     * @param bagTemplateSite Association chargee avec ses relations.
     */
    private toEntity(bagTemplateSite: BagTemplateSiteWithRelations) {
        return new BagTemplateSiteEntity(bagTemplateSite);
    }
}
