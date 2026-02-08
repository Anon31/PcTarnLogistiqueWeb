import { IUserDto } from './user';
import { IRoleDto } from './role';

/**
 * TYPE DÉDIÉ À L'UTILISATEUR CONNECTÉ (Session)
 * Utilisé pour typer currentUser le AuthService
 */
export type IAuthUser = Pick<IUserDto, 'id' | 'email' | 'firstname' | 'lastname'> & {
    roles: IRoleDto[];
};

/**
 * DTO DE RÉPONSE LOGIN
 */
export interface ILoginDto {
    access_token: string;
    message: string;
    user: IAuthUser;
}

/**
 * PAYLOAD DE LOGIN
 */
export interface ILoginPayload {
    email: string;
    password: string;
}
