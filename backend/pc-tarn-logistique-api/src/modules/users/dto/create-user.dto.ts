import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateNested, IsInt, IsDateString, IsEnum } from 'class-validator';
import { UserRole } from '../../../enums/user-role.enum';
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

    @IsDateString()
    @IsOptional()
    birthdate?: string;

    // Validation stricte basée sur l'Enum
    @IsEnum(UserRole, { message: 'Le rôle doit être ADMIN, MANAGER ou BENEVOLE' })
    @IsNotEmpty({ message: 'Le rôle est obligatoire' })
    role: UserRole;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address?: CreateAddressDto;
}
