import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateNested, IsInt, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// On redéfinit l'enum ici pour que Swagger et ClassValidator puissent l'utiliser
// sans dépendre directement du fichier généré par Prisma (bonne pratique Clean Arch)
export enum UserRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    BENEVOLE = 'BENEVOLE',
}

export class CreateAddressDto {
    @IsInt()
    @IsNotEmpty()
    number: number;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    zipcode: string;

    @IsString()
    @IsNotEmpty()
    state: string;
}

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
     * Le rôle de l'utilisateur (Enum)
     * @example 'BENEVOLE'
     */
    @IsEnum(UserRole, { message: 'Le rôle doit être ADMIN, MANAGER ou BENEVOLE' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    role: UserRole;

    /**
     * L'ID du site (Antenne) auquel l'utilisateur est rattaché
     * @example 1
     */
    @IsInt({ message: "L'ID du site doit être un nombre entier" })
    @IsOptional()
    siteId?: number;

    // Optionnel : Permet de créer l'adresse en même temps
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto;
}
