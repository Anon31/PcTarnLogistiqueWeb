import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BagTemplateService } from './bag-template.service';
import { BagTemplateController } from './bag-template.controller';

/**
 * Module NestJS regroupant le controleur, le service et l'acces Prisma
 * necessaires a la gestion des modeles de sac.
 */
@Module({
    controllers: [BagTemplateController],
    providers: [BagTemplateService, PrismaService],
})
export class BagTemplateModule {}
