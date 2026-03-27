export interface IProductDto {
    id: number;
    name: string;
    category: string;
    minThreshold: number;
    isPerishable: boolean;
}

export interface IProductPayload {
    name: string;
    category: string;
    minThreshold: number;
    isPerishable: boolean;
}

// import { ISiteDto } from '../../../shared/models/site.model';
//
// /** Informations de base du catalogue produit */
// export interface IProductMetadataDto {
//     id: number;
//     name: string;
//     category: string;
//     minThreshold: number;
//     isPerishable: boolean;
// }
//
// /** Gestion des lots et péremptions */
// export interface IProductBatchNumberDto {
//     id: number;
//     number: string;
//     expiryDate?: string;
//     status: 'DISPONIBLE' | 'NON_OPERATIONNEL';
// }
//
// /** Entité Produit en inventaire (Quantité et état) */
// export interface IProductDto {
//     id: number;
//     quantity: number;
//     condition: string;
//     productMetadataId: number;
//     siteId?: number;
//     productBatchNumberId?: number;
//     productMetadata?: IProductMetadataDto;
//     site?: ISiteDto;
//     productBatchNumber?: IProductBatchNumberDto;
// }
//
// /** Payload pour la création/mise à jour d'un produit en inventaire */
// export interface IProductPayload {
//     quantity: number;
//     condition: string;
//     productMetadataId: number;
//     siteId?: number;
//     productBatchNumberId?: number;
// }
