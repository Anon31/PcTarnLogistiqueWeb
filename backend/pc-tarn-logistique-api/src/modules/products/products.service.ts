import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Crée un nouveau produit dans la base de données.
     * Les données du produit sont fournies via le DTO `CreateProductDto`.
     * @param dto
     */
    async create(dto: CreateProductDto) {
        const product = await this.prisma.product.create({
            data: dto,
        });
        return new ProductEntity(product);
    }

    /**
     * Récupère tous les produits ainsi que les informations du stock et du dernier movement effectué sur chaque lot de produits de la base de données. Les produits sont triés par ID croissant pour une lecture plus intuitive.
     */
    async findAll() {
        const products = await this.prisma.product.findMany({
            orderBy: { id: 'asc' },
            include: {
                stocks: {
                    select: {
                        id: true,
                        quantity: true,
                        condition: true,
                        site: {
                            select: {
                                name: true,
                            },
                        },
                        productBatchNumber: {
                            select: {
                                id: true,
                                number: true,
                                status: true,
                                expiryDate: true,
                                stockMovements: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                },
            },
        });

        return products.map((product) => new ProductEntity(product));
    }

    /**
     * Trouve un produit par son ID. Si le produit n'existe pas, une exception NotFoundException est levée.
     * @param id
     */
    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) throw new NotFoundException(`Produit #${id} introuvable`);

        return new ProductEntity(product);
    }

    /**
     * Met à jour un produit existant dans la base de données.
     * @param id
     * @param dto
     */
    async update(id: number, dto: UpdateProductDto) {
        await this.findOne(id); // Vérifie que le produit existe avant de tenter la mise à jour

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: dto,
        });
        return new ProductEntity(updatedProduct);
    }

    /**
     * Supprime un produit de la base de données. Avant de tenter la suppression,
     * la méthode vérifie que le produit existe en appelant `findOne`.
     * Si le produit n'existe pas, une exception NotFoundException est levée,
     * empêchant ainsi une tentative de suppression infructueuse.
     * @param id
     */
    async remove(id: number) {
        await this.findOne(id); // Vérifie que le produit existe avant la suppression

        const deletedProduct = await this.prisma.product.delete({
            where: { id },
        });
        return new ProductEntity(deletedProduct);
    }
}
