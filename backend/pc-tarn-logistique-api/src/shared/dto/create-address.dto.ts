import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty({ example: 12 })
    @IsInt()
    @IsOptional()
    number: number;

    @ApiProperty({ example: 'Rue de la Logistique' })
    @IsString()
    @IsOptional()
    street: string;

    @ApiProperty({ example: 'Albi' })
    @IsString()
    @IsOptional()
    city: string;

    @ApiProperty({ example: '81000' })
    @IsString()
    @IsOptional()
    zipcode: string;

    @ApiProperty({ example: 'France' })
    @IsString()
    @IsOptional()
    state: string;
}
