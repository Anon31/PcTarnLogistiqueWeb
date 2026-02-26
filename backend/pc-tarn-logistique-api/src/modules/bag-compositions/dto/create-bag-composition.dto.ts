import { BagStatus, CheckType } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsObject } from 'class-validator';

export class CreateBagCompositionDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(CheckType)
  @IsNotEmpty()
  checkType: CheckType;

  @IsObject()
  @IsNotEmpty()
  itemsData: Record<string, unknown>;

  @IsEnum(BagStatus)
  @IsNotEmpty()
  status: BagStatus;

  @IsInt()
  @IsNotEmpty()
  siteId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;
}
