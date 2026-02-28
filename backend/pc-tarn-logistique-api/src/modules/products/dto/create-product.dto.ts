import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ItemCategory } from '@prisma/client';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(ItemCategory)
    @IsNotEmpty()
    category: ItemCategory;

    @IsInt()
    @Min(0)
    minThreshold: number;

    @IsBoolean()
    isPerishable: boolean;
}
