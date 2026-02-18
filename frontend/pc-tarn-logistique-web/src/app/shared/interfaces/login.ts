import { IUserDto } from './user';

/**
 * TYPE DÉDIÉ À L'UTILISATEUR CONNECTÉ (Session)
 * Utilisé pour typer userConnectedSignal dans AuthService
 */
export type IAuthUser = Pick<IUserDto, 'id' | 'email' | 'firstname' | 'lastname' | 'role'>;

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
