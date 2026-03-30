import { ApiProperty } from '@nestjs/swagger';
import { BatchStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO utilise pour creer un lot de fabrication produit.
 * Il decrit les informations minimales attendues par l'API.
 */
export class CreateProductBatchNumberDto {
    @ApiProperty({
        description: 'Numero du lot de fabrication',
        example: 'LOT-COMP-2027-01',
    })
    @IsString()
    @IsNotEmpty()
    number: string;

    @ApiProperty({
        description: 'Date de peremption du lot',
        example: '2027-01-31T00:00:00.000Z',
        required: false,
        nullable: true,
    })
    @Type(() => Date)
    @IsDate({ message: 'La date de peremption doit etre une date valide' })
    @IsOptional()
    expiryDate?: Date;

    @ApiProperty({
        enum: BatchStatus,
        description: 'Statut du lot',
        example: BatchStatus.VALID,
        required: false,
    })
    @IsEnum(BatchStatus, { message: 'Le statut du lot doit etre valide' })
    @IsOptional()
    status?: BatchStatus;
}
