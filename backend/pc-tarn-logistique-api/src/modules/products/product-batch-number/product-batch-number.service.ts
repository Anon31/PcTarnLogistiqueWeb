import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProductBatchNumberDto } from './dto/create-product-batch-number.dto';
import { UpdateProductBatchNumberDto } from './dto/update-product-batch-number.dto';
import { ProductBatchNumberEntity } from './entities/product-batch-number.entity';

const productBatchNumberRelations = {
    stocks: {
        include: {
            product: true,
            site: true,
        },
        orderBy: {
            id: 'asc',
        },
    },
    stockMovements: {
        include: {
            product: true,
            site: true,
        },
        orderBy: {
            id: 'asc',
        },
    },
} satisfies Prisma.ProductBatchNumberInclude;

type ProductBatchNumberWithRelations = Prisma.ProductBatchNumberGetPayload<{
    include: typeof productBatchNumberRelations;
}>;

/**
 * Service metier charge de la gestion des lots de fabrication produit.
 * Il centralise les acces Prisma et la transformation des donnees en entites API.
 */
@Injectable()
export class ProductBatchNumberService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Cree un nouveau lot de fabrication et charge ses relations utiles.
     * @param dto Donnees de creation du lot.
     */
    async create(dto: CreateProductBatchNumberDto) {
        const productBatchNumber = await this.prisma.productBatchNumber.create({
            data: dto,
            include: productBatchNumberRelations,
        });

        return this.toEntity(productBatchNumber);
    }

    /**
     * Recupere tous les lots de fabrication, tries par identifiant croissant.
     */
    async findAll() {
        const productBatchNumbers = await this.prisma.productBatchNumber.findMany({
            include: productBatchNumberRelations,
            orderBy: { id: 'asc' },
        });

        return productBatchNumbers.map((productBatchNumber) => this.toEntity(productBatchNumber));
    }

    /**
     * Recherche un lot de fabrication par son identifiant.
     * Une exception est levee si aucun lot ne correspond.
     * @param id Identifiant du lot recherche.
     */
    async findOne(id: number) {
        const productBatchNumber = await this.prisma.productBatchNumber.findUnique({
            where: { id },
            include: productBatchNumberRelations,
        });

        if (!productBatchNumber) throw new NotFoundException(`ProductBatchNumber #${id} introuvable`);

        return this.toEntity(productBatchNumber);
    }

    /**
     * Met a jour un lot de fabrication apres verification de son existence.
     * @param id Identifiant du lot a modifier.
     * @param dto Donnees de mise a jour.
     */
    async update(id: number, dto: UpdateProductBatchNumberDto) {
        await this.findOne(id);

        const productBatchNumber = await this.prisma.productBatchNumber.update({
            where: { id },
            data: dto,
            include: productBatchNumberRelations,
        });

        return this.toEntity(productBatchNumber);
    }

    /**
     * Supprime un lot de fabrication apres verification de son existence.
     * @param id Identifiant du lot a supprimer.
     */
    async remove(id: number) {
        await this.findOne(id);

        const productBatchNumber = await this.prisma.productBatchNumber.delete({
            where: { id },
            include: productBatchNumberRelations,
        });

        return this.toEntity(productBatchNumber);
    }

    /**
     * Transforme le resultat Prisma en entite API.
     * @param productBatchNumber Lot de fabrication charge avec ses relations.
     */
    private toEntity(productBatchNumber: ProductBatchNumberWithRelations) {
        return new ProductBatchNumberEntity(productBatchNumber);
    }
}
