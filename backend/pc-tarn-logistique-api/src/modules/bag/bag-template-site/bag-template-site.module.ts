import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateSiteService } from './bag-template-site.service';
import { BagTemplateSiteController } from './bag-template-site.controller';

@Module({
    controllers: [BagTemplateSiteController],
    providers: [BagTemplateSiteService, PrismaService],
})
export class BagTemplateSiteModule {}
