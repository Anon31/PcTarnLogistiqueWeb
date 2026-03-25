import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateService } from './bag-template.service';
import { BagTemplateController } from './bag-template.controller';

@Module({
    controllers: [BagTemplateController],
    providers: [BagTemplateService, PrismaService],
})
export class BagTemplateModule {}
