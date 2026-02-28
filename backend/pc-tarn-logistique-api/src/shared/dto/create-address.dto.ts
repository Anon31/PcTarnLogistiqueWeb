import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty({ example: 12 })
    @IsInt()
    @IsNotEmpty()
    number: number;

    @ApiProperty({ example: 'Rue de la Logistique' })
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty({ example: 'Albi' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: '81000' })
    @IsString()
    @IsNotEmpty()
    zipcode: string;

    @ApiProperty({ example: 'France' })
    @IsString()
    @IsNotEmpty()
    state: string;
}
