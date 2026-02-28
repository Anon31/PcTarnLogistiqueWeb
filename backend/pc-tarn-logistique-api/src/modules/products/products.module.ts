import { PrismaService } from '../../prisma/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
