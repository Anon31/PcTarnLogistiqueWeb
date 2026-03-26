import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateDto } from './dto/create-bag-template.dto';
import { UpdateBagTemplateDto } from './dto/update-bag-template.dto';
import { BagTemplateEntity } from './entities/bag-template.entity';

const bagTemplateRelations = {
    items: {
        include: {
            product: true,
        },
        orderBy: {
            id: 'asc',
        },
    },
} satisfies Prisma.BagTemplateInclude;

type BagTemplateWithRelations = Prisma.BagTemplateGetPayload<{
    include: typeof bagTemplateRelations;
}>;

@Injectable()
export class BagTemplateService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateBagTemplateDto) {
        const bagTemplate = await this.prisma.bagTemplate.create({
            data: dto,
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    async findAll() {
        const bagTemplates = await this.prisma.bagTemplate.findMany({
            include: bagTemplateRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplates.map((bagTemplate) => this.toEntity(bagTemplate));
    }

    async findOne(id: number) {
        const bagTemplate = await this.prisma.bagTemplate.findUnique({
            where: { id },
            include: bagTemplateRelations,
        });

        if (!bagTemplate) throw new NotFoundException(`BagTemplate #${id} introuvable`);

        return this.toEntity(bagTemplate);
    }

    async update(id: number, dto: UpdateBagTemplateDto) {
        await this.findOne(id);

        const bagTemplate = await this.prisma.bagTemplate.update({
            where: { id },
            data: dto,
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    async remove(id: number) {
        await this.findOne(id);

        const bagTemplate = await this.prisma.bagTemplate.delete({
            where: { id },
            include: bagTemplateRelations,
        });

        return this.toEntity(bagTemplate);
    }

    private toEntity(bagTemplate: BagTemplateWithRelations) {
        return new BagTemplateEntity(bagTemplate);
    }
}
