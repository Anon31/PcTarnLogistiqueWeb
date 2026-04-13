import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';

const siteRelations = {
    address: true,
    bagChecks: true,
} satisfies Prisma.SiteInclude;

type SiteWithRelations = Prisma.SiteGetPayload<{
    include: typeof siteRelations;
}>;
type SiteWithoutRelations = Omit<SiteWithRelations, keyof typeof siteRelations>;

/**
 * Service metier charge de la gestion des sites.
 * Il centralise les acces Prisma et la transformation des resultats en entites API.
 */
@Injectable()
export class SiteService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Cree un site et son adresse eventuelle.
     * @param dto Donnees de creation du site.
     */
    async create(dto: CreateSiteDto) {
        const site = await this.prisma.site.create({
            data: this.buildCreateData(dto),
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    /**
     * Recupere tous les sites sans leurs relations utiles.
     */
    async findAll() {
        const sites = await this.prisma.site.findMany({
            orderBy: { id: 'asc' },
        });

        return sites.map((site) => this.toEntity(site));
    }

    /**
     * Recupere tous les sites outdoor avec leur dernier controle de sac.
     */
    async findAllOutDoors() {
        const sites = await this.prisma.site.findMany({
            where: { type: SiteType.OUTDOOR },
            include: {
                address: true,
                bagChecks: {
                    orderBy: { date: 'desc' },
                    take: 1, // On conserve uniquement le dernier bagCheck de chaque site outdoor.
                },
            },
            orderBy: { id: 'asc' },
        });

        return sites.map((site) => this.toEntity(site));
    }

    /**
     * Recupere les produits attendus pour un site outdoor a partir de son modele de sac.
     * @param id Identifiant du site outdoor.
     */
    async findAllExpectedOutdoorItems(id: number) {
        const site = await this.prisma.site.findUnique({
            where: { id },
            select: {
                bagTemplateSite: {
                    select: {
                        bagTemplate: {
                            select: {
                                items: {
                                    select: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!site) {
            throw new NotFoundException(`Site #${id} introuvable`);
        }

        // On aplatit les produits du modele template dans un tableau simple.
        const products = site.bagTemplateSite?.bagTemplate?.items.map((item) => item.product) ?? [];
        if (products.length === 0) {
            throw new NotFoundException(`Aucun produit template n'a ete trouve pour le site #${id}`);
        }

        return products;
    }

    /**
     * Recupere un site par son identifiant.
     * @param id Identifiant du site recherche.
     */
    async findOne(id: number) {
        const site = await this.prisma.site.findUnique({
            where: { id },
            include: siteRelations,
        });

        if (!site) throw new NotFoundException(`Site #${id} introuvable`);

        return this.toEntity(site);
    }

    /**
     * Met a jour un site apres verification de son existence.
     * @param id Identifiant du site a modifier.
     * @param dto Donnees de mise a jour.
     */
    async update(id: number, dto: UpdateSiteDto) {
        await this.findOne(id); // On verifie d'abord que le site existe.

        const site = await this.prisma.site.update({
            where: { id },
            data: this.buildUpdateData(dto),
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    /**
     * Supprime un site apres verification de son existence.
     * @param id Identifiant du site a supprimer.
     */
    async remove(id: number) {
        await this.findOne(id); // On verifie d'abord que le site existe.

        const site = await this.prisma.site.delete({
            where: { id },
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    /**
     * Construit les donnees Prisma necessaires a la creation d'un site.
     * @param dto Donnees entrantes du site.
     */
    private buildCreateData(dto: CreateSiteDto): Prisma.SiteCreateInput {
        const { address, ...siteData } = dto;

        return {
            ...siteData,
            address: address ? { create: address } : undefined,
        };
    }

    /**
     * Construit les donnees Prisma necessaires a la mise a jour d'un site.
     * @param dto Donnees de mise a jour du site.
     */
    private buildUpdateData(dto: UpdateSiteDto): Prisma.SiteUpdateInput {
        const { address, ...siteData } = dto;

        return {
            ...siteData,
            address: address ? { upsert: { create: address, update: address } } : undefined,
        };
    }

    /**
     * Transforme un resultat Prisma en entite API.
     * @param site Site charge avec ses relations.
     */
    private toEntity(site: SiteWithRelations | SiteWithoutRelations) {
        return new SiteEntity({
            ...site,
            // On convertit les valeurs null de Prisma en undefined pour TypeScript.
        });
    }
}
