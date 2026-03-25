import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateItemService } from './bag-template-item.service';
import { BagTemplateItemController } from './bag-template-item.controller';

@Module({
    controllers: [BagTemplateItemController],
    providers: [BagTemplateItemService, PrismaService],
})
export class BagTemplateItemModule {}
