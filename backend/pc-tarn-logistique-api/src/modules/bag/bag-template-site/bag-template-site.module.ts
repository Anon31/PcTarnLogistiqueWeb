import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateSiteService } from './bag-template-site.service';
import { BagTemplateSiteController } from './bag-template-site.controller';

/**
 * Module NestJS dedie a la gestion des liens entre sites et modeles de sac.
 * Il assemble le controleur, le service et Prisma pour cette fonctionnalite.
 */
@Module({
    controllers: [BagTemplateSiteController],
    providers: [BagTemplateSiteService, PrismaService],
})
export class BagTemplateSiteModule {}
