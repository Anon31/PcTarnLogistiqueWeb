import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateProductDto) {
        try {
            return await this.prisma.product.create({
                data: dto,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    findAll() {
        return this.prisma.product.findMany({
            orderBy: { id: 'asc' },
        });
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Produit #${id} introuvable`);
        }

        return product;
    }

    async update(id: number, dto: UpdateProductDto) {
        await this.findOne(id);

        try {
            return await this.prisma.product.update({
                where: { id },
                data: dto,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    async remove(id: number) {
        await this.findOne(id);

        try {
            return await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    }

    private handlePrismaError(error: unknown): never {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const code = (error as { code?: string }).code;

            if (code === 'P2002') {
                throw new ConflictException('Un produit avec ce nom existe deja');
            }

            if (code === 'P2025') {
                throw new NotFoundException('Produit introuvable');
            }

            if (code === 'P2003') {
                throw new ConflictException('Produit utilise dans des relations existantes');
            }
        }

        throw new InternalServerErrorException('Erreur sur Produit');
    }
}
