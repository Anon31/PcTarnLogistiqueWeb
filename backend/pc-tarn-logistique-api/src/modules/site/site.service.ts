import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SiteType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';
import { BagTemplateSiteService } from '../bag/bag-template-site/bag-template-site.service';
import { json } from 'stream/consumers';

const siteRelations = {
    address: true,
    bagChecks:true,
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
            where: { type: SiteType.OUTDOOR},
            include: {
                address:true,
                bagChecks:{
                    orderBy:{date: 'desc'}
                }
            },
            orderBy: { id: 'asc' }
        });

        return sites.map((site) => this.toEntity(site));
    }
    
    async findAllExpectedOutdoorItems(id:number){
        const bagTemplateSite = this.prisma.bagTemplateSite.findFirst(
            {
                where:{
                    siteId:id
                }
            }

        )
        return bagTemplateSite
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
        const { address, ...siteData } = dto;

        return {
            ...siteData,
            address: address ? { create: address } : undefined,
        };
    }

    private buildUpdateData(dto: UpdateSiteDto): Prisma.SiteUpdateInput {
        const { address,...siteData } = dto;

        return {
            ...siteData,
            address: address ? { upsert: { create: address, update: address } } : undefined,
        };
    }

    private toEntity(site: SiteWithRelations) {
        return new SiteEntity({
            ...site,
            // On convertit les 'null' de Prisma en 'undefined' pour TypeScript
            address: site.address ?? undefined,
        });
    }
}
