import { Module } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { SiteService } from '../site/site.service';


@Module({
  controllers: [StockMovementController],
  providers: [StockMovementService,PrismaService,SiteService],
})
export class StockMovementModule {}
