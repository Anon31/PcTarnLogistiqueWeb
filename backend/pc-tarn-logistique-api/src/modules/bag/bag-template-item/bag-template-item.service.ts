import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateItemDto } from './dto/create-bag-template-item.dto';
import { UpdateBagTemplateItemDto } from './dto/update-bag-template-item.dto';
import { BagTemplateItemEntity } from './entities/bag-template-item.entity';

const bagTemplateItemRelations = {
    bagTemplate: true,
    product: true,
} satisfies Prisma.BagTemplateItemInclude;

type BagTemplateItemWithRelations = Prisma.BagTemplateItemGetPayload<{
    include: typeof bagTemplateItemRelations;
}>;

@Injectable()
export class BagTemplateItemService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateBagTemplateItemDto) {
        const bagTemplateItem = await this.prisma.bagTemplateItem.create({
            data: dto,
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    async findAll() {
        const bagTemplateItems = await this.prisma.bagTemplateItem.findMany({
            include: bagTemplateItemRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplateItems.map((bagTemplateItem) => this.toEntity(bagTemplateItem));
    }

    async findOne(id: number) {
        const bagTemplateItem = await this.prisma.bagTemplateItem.findUnique({
            where: { id },
            include: bagTemplateItemRelations,
        });

        if (!bagTemplateItem) throw new NotFoundException(`BagTemplateItem #${id} introuvable`);

        return this.toEntity(bagTemplateItem);
    }

    async update(id: number, dto: UpdateBagTemplateItemDto) {
        await this.findOne(id);

        const bagTemplateItem = await this.prisma.bagTemplateItem.update({
            where: { id },
            data: dto,
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    async remove(id: number) {
        await this.findOne(id);

        const bagTemplateItem = await this.prisma.bagTemplateItem.delete({
            where: { id },
            include: bagTemplateItemRelations,
        });

        return this.toEntity(bagTemplateItem);
    }

    private toEntity(bagTemplateItem: BagTemplateItemWithRelations) {
        return new BagTemplateItemEntity(bagTemplateItem);
    }
}
