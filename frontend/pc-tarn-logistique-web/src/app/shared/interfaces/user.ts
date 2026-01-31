import { IRole } from './role';
import { IAddress } from './address';

export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    birthdate: Date;
    createdAt: Date;
    updatedAt: Date;
    enabled: boolean;
    roles: IRole[];
    address?: IAddress;
}
