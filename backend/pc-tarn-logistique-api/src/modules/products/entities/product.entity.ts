import { Product, ItemCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Représente un produit médical dans le système de gestion de stock.
 * Cette classe implémente l'interface Product définie par Prisma et est utilisée pour structurer les données des produits
 * dans les réponses API. Elle inclut des décorateurs Swagger pour documenter les propriétés du produit.
 */
export class ProductEntity implements Product {
    @ApiProperty({ description: 'Identifiant unique du produit', example: 1 })
    id: number;

    @ApiProperty({ description: 'Nom du produit (doit être unique)', example: 'Défibrillateur' })
    name: string;

    @ApiProperty({ enum: ItemCategory, description: 'Catégorie médicale du produit' })
    category: ItemCategory;

    @ApiProperty({ description: "Seuil d'alerte de stock minimum", example: 5 })
    minThreshold: number;

    @ApiProperty({ description: 'Indique si le produit a une date de péremption', example: false })
    isPerishable: boolean;

    constructor(partial: Partial<ProductEntity>) {
        Object.assign(this, partial);
    }
}
