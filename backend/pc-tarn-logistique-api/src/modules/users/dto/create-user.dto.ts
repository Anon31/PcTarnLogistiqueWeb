import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateNested, IsInt, IsDateString, IsEnum } from 'class-validator';
import { CreateAddressDto } from '../../../shared/dto/create-address.dto';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    /**
     * L'adresse email de l'utilisateur (doit être unique)
     * @example 'jean.dupont@email.com'
     */
    @IsEmail({}, { message: "Format d'email invalide" })
    @IsNotEmpty()
    email: string;

    /**
     * Le mot de passe de l'utilisateur (au moins 8 caractères)
     * @example 'P@ssw0rd123'
     */
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Mot de passe trop court' })
    password: string;

    @IsString()
    @IsOptional()
    phone?: string;

    /**
     * La date de naissance de l'utilisateur au format ISO 8601 (YYYY-MM-DD)
     * @example '1990-05-15'
     */
    @IsDateString()
    @IsOptional()
    birthdate?: string;

    /**
     * Le rôle de l'utilisateur (Enum Prisma)
     * @example 'BENEVOLE'
     */
    @IsEnum(Role, { message: 'Le rôle doit être ADMIN, MANAGER ou BENEVOLE' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    role: Role;

    /**
     * L'ID du site (Antenne) auquel l'utilisateur est rattaché.
     * Donnée métier essentielle pour afficher les données de l'entrepôt par défaut.
     * @example 1
     */
    @IsInt({ message: "L'ID du site doit être un nombre entier" })
    @IsNotEmpty({ message: 'Le site de rattachement est obligatoire' })
    siteId: number;

    // Optionnel : Permet de créer l'adresse en même temps
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto;
}
