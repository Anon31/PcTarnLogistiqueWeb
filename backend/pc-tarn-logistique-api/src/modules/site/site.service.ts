import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';

const siteRelations = {
    address: true,
    bagTemplate: true, // ✅ include bagTemplate relation
} satisfies Prisma.SiteInclude;

type SiteWithRelations = Prisma.SiteGetPayload<{
    include: typeof siteRelations;
}>;

@Injectable()
export class SiteService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateSiteDto) {
        const site = await this.prisma.site.create({
            data: this.buildCreateData(dto),
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    async findAll() {
        const sites = await this.prisma.site.findMany({
            include: siteRelations,
            orderBy: { id: 'asc' },
        });

        return sites.map((site) => this.toEntity(site));
    }

    async findAllOutDoors() {
        const sites = await this.prisma.site.findMany({
            where: { type: SiteType.OUTDOOR },
            include: siteRelations,
            orderBy: { id: 'asc' },
        });

        return sites.map((site) => this.toEntity(site));
    }

    async findOne(id: number) {
        const site = await this.prisma.site.findUnique({
            where: { id },
            include: siteRelations,
        });

        if (!site) throw new NotFoundException(`Site #${id} not found`);

        return this.toEntity(site);
    }

    async update(id: number, dto: UpdateSiteDto) {
        await this.findOne(id); // ensure exists

        const site = await this.prisma.site.update({
            where: { id },
            data: this.buildUpdateData(dto),
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    async remove(id: number) {
        await this.findOne(id); // ensure exists

        const site = await this.prisma.site.delete({
            where: { id },
            include: siteRelations,
        });

        return this.toEntity(site);
    }

    // ---------------------------
    // PRIVATE HELPERS
    // ---------------------------

    private buildCreateData(dto: CreateSiteDto): Prisma.SiteCreateInput {
        const { address, bagTemplateId, ...siteData } = dto;

        return {
            ...siteData,
            bagTemplate: { connect: { id: bagTemplateId } }, // ✅ required relation
            address: address ? { create: address } : undefined,
        };
    }

    private buildUpdateData(dto: UpdateSiteDto): Prisma.SiteUpdateInput {
        const { address, bagTemplateId, ...siteData } = dto;

        return {
            ...siteData,
            ...(bagTemplateId ? { bagTemplate: { connect: { id: bagTemplateId } } } : {}),
            address: address
                ? { upsert: { create: address, update: address } }
                : undefined,
        };
    }

    private toEntity(site: SiteWithRelations) {
        return new SiteEntity(site);
    }
}
