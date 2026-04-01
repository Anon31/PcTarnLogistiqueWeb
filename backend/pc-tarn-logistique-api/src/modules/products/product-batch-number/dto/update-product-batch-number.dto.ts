import { PartialType } from '@nestjs/swagger';
import { CreateProductBatchNumberDto } from './create-product-batch-number.dto';

/**
 * DTO utilise pour mettre a jour un lot de fabrication produit.
 * Toutes les proprietes de creation y deviennent optionnelles.
 */
export class UpdateProductBatchNumberDto extends PartialType(CreateProductBatchNumberDto) {}
