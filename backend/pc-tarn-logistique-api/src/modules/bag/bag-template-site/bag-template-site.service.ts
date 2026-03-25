import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBagTemplateSiteDto } from './dto/create-bag-template-site.dto';
import { UpdateBagTemplateSiteDto } from './dto/update-bag-template-site.dto';
import { BagTemplateSiteEntity } from './entities/bag-template-site.entity';

const bagTemplateSiteRelations = {
    site: true,
    bagTemplate: true,
} satisfies Prisma.BagTemplateSiteInclude;

type BagTemplateSiteWithRelations = Prisma.BagTemplateSiteGetPayload<{
    include: typeof bagTemplateSiteRelations;
}>;

@Injectable()
export class BagTemplateSiteService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateBagTemplateSiteDto) {
        const bagTemplateSite = await this.prisma.bagTemplateSite.create({
            data: dto,
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    async findAll() {
        const bagTemplateSites = await this.prisma.bagTemplateSite.findMany({
            include: bagTemplateSiteRelations,
            orderBy: { id: 'asc' },
        });

        return bagTemplateSites.map((bagTemplateSite) => this.toEntity(bagTemplateSite));
    }

    async findOne(id: number) {
        const bagTemplateSite = await this.prisma.bagTemplateSite.findUnique({
            where: { id },
            include: bagTemplateSiteRelations,
        });

        if (!bagTemplateSite) throw new NotFoundException(`BagTemplateSite #${id} introuvable`);

        return this.toEntity(bagTemplateSite);
    }

    async update(id: number, dto: UpdateBagTemplateSiteDto) {
        await this.findOne(id);

        const bagTemplateSite = await this.prisma.bagTemplateSite.update({
            where: { id },
            data: dto,
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    async remove(id: number) {
        await this.findOne(id);

        const bagTemplateSite = await this.prisma.bagTemplateSite.delete({
            where: { id },
            include: bagTemplateSiteRelations,
        });

        return this.toEntity(bagTemplateSite);
    }

    private toEntity(bagTemplateSite: BagTemplateSiteWithRelations) {
        return new BagTemplateSiteEntity(bagTemplateSite);
    }
}
