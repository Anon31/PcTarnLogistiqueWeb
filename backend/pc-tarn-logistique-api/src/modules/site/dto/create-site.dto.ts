import { ApiProperty } from '@nestjs/swagger';
import { SiteType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from '../../../shared/dto/create-address.dto';

/**
 * DTO utilise pour creer un site.
 * Il transporte les informations d'identification du site et son adresse eventuelle.
 */
export class CreateSiteDto {
    @ApiProperty({ description: 'Nom du site', example: "Antenne d'Albi" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        enum: SiteType,
        description: 'Type de site',
        example: SiteType.INDOOR,
    })
    @IsEnum(SiteType)
    @IsNotEmpty()
    type: SiteType;

    @ApiProperty({ description: 'Code unique du site', example: 'ALB' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        description: 'Adresse du site',
        required: false,
        type: CreateAddressDto,
    })

    @ValidateNested()
    @Type(() => CreateAddressDto)
    @IsOptional()
    address?: CreateAddressDto;
}
