import { Condition } from '../enums/condition.enum';

export interface IProductDto {
    id: number;
    name: string;
    category: string;
    minThreshold: number;
    isPerishable: boolean;
}

export interface ISiteDto {
    id: number;
    name: string;
    code: string;
    type: string;
}

export interface IProductBatchNumberDto {
    id: number;
    number: string;
    expiryDate?: string;
    status: 'DISPONIBLE' | 'NON_OPERATIONNEL';
}

export interface IStockDto {
    id: number;
    quantity: number;
    condition: Condition;
    productId: number;
    siteId?: number;
    productBatchNumberId?: number;
    // Relations hydratées
    product?: IProductDto;
    site?: ISiteDto;
    productBatchNumber?: IProductBatchNumberDto;
}

export interface IStockPayload {
    quantity: number;
    condition: Condition;
    productId: number;
    siteId?: number;
    productBatchNumberId?: number;
}