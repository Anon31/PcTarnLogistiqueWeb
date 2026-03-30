import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProductBatchNumberController } from './product-batch-number.controller';
import { ProductBatchNumberService } from './product-batch-number.service';

/**
 * Module NestJS regroupant les composants necessaires
 * a la gestion des lots de fabrication produit.
 */
@Module({
    controllers: [ProductBatchNumberController],
    providers: [ProductBatchNumberService, PrismaService],
})
export class ProductBatchNumberModule {}
