import { IRoleDto } from './role';
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
    createdAt: string;
    updatedAt: string;
    enabled: boolean;
    roles: IRoleDto[];
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
    roles: string; // Envoi : Une simple string "MANAGER"
    address?: IAddressPayload;
}
