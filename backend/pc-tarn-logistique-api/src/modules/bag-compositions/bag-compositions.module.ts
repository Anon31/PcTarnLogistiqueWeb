import { Module } from '@nestjs/common';
import { BagCompositionsService } from './bag-compositions.service';
import { BagCompositionsController } from './bag-compositions.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BagCompositionsController],
  providers: [BagCompositionsService, PrismaService],
})
export class BagCompositionsModule {}
