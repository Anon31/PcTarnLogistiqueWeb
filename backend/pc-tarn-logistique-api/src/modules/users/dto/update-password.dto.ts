import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({ message: "L'ancien mot de passe est requis" })
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Le nouveau mot de passe doit faire au moins 8 caractères' })
    newPassword: string;
}
