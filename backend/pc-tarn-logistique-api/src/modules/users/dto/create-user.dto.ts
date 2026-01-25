import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    ValidateNested,
    IsInt,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

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
    zipCode: string;

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

    @IsEmail({}, { message: "Format d'email invalide" })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Mot de passe trop court' })
    password: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsDateString() // Valide le format ISO 8601 (envoyé par Angular)
    @IsOptional()
    birthDate?: string;

    // Optionnel : Permet de créer l'adresse en même temps
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto;
}
