import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductBatchSummaryEntity } from './entities/product-batch-summary.entity';
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

    async findAllBySite(siteId: number) {
        const products = await this.prisma.product.findMany({
            where: {
                stocks: {
                    some: { siteId },
                },
            },
            select: {
                id: true,
                name: true,
                category: true,
                minThreshold: true,
                isPerishable: true,
                stocks: {
                    where: { siteId },
                    select: {
                        quantity: true,
                    },
                },
            },
            orderBy: { id: 'desc' },
        });

        return products.map((product) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            minThreshold: product.minThreshold,
            isPerishable: product.isPerishable,
            quantity: product.stocks.reduce((sum, stock) => sum + stock.quantity, 0),
            siteId,
        }));
    }

    async findBatchesBySite(productId: number, siteId: number) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                stocks: {
                    where: { siteId },
                    select: {
                        id: true,
                        quantity: true,
                        productBatchNumber: {
                            select: {
                                id: true,
                                number: true,
                                expiryDate: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Produit #${productId} introuvable`);
        }

        const batches = new Map<number, ProductBatchSummaryEntity>();

        for (const stock of product.stocks) {
            const batch = stock.productBatchNumber;
            if (!batch) {
                continue;
            }

            const currentBatch = batches.get(batch.id);
            if (currentBatch) {
                currentBatch.quantity += stock.quantity;
                continue;
            }

            batches.set(
                batch.id,
                new ProductBatchSummaryEntity({
                    id: product.id,
                    name: product.name,
                    number: batch.number,
                    expiryDate: batch.expiryDate,
                    status: batch.status,
                    quantity: stock.quantity,
                }),
            );
        }

        return [...batches.values()].sort((left, right) => {
            const leftExpiry = left.expiryDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
            const rightExpiry = right.expiryDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

            if (leftExpiry !== rightExpiry) {
                return leftExpiry - rightExpiry;
            }

            return left.number.localeCompare(right.number);
        });
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
