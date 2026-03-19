import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';

@Module({
    controllers: [SiteController],
    providers: [SiteService, PrismaService],
})
export class SiteModule {}
