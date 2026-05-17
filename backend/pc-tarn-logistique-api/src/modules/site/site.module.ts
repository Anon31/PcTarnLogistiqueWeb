import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { StockMovementService } from '../stock-movement/stock-movement.service';

/**
 * Module NestJS dedie a la gestion des sites.
 * Il assemble le controleur, le service et l'acces a Prisma.
 */
@Module({
    controllers: [SiteController],
    providers: [SiteService, PrismaService, StockMovementService],
})
export class SiteModule {}
