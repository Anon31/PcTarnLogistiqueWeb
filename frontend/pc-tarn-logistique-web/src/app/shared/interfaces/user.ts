import { IAddressDto, IAddressPayload } from './address';

/**
 * Ce que l'API nous renvoie après un get user réussi.
 */
export interface IUserDto {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    birthdate: string;
    enabled: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
    siteId: number;
    address?: IAddressDto;
}

/**
 * PAYLOAD DE CRÉATION (Admin -> Create User)
 * Ce qui est envoyé via le formulaire.
 */
export interface IUserPayload {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    birthdate?: string;
    role: string;
    siteId: number;
    address?: IAddressPayload;
}
