import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateItemService } from './bag-template-item.service';
import { BagTemplateItemController } from './bag-template-item.controller';

/**
 * Module NestJS dedie a la gestion des articles theoriques des modeles de sac.
 * Il regroupe le controleur, le service et l'acces a Prisma.
 */
@Module({
    controllers: [BagTemplateItemController],
    providers: [BagTemplateItemService, PrismaService],
})
export class BagTemplateItemModule {}
