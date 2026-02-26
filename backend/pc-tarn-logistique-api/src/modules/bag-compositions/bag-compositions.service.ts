import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Response
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBagCompositionDto } from './dto/create-bag-composition.dto';
import { UpdateBagCompositionDto } from './dto/update-bag-composition.dto';
import { response } from 'express';

@Injectable()
export class BagCompositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBagCompositionDto) {
    try {
      return "this action create a bag composition (lot)";
      // return await this.prisma.bagComposition.create();
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll() {
    return this.prisma.bagComposition.findMany({
      include: { site: true, product: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const bagComposition = await this.prisma.bagComposition.findUnique({
      where: { id },
      include: { site: true, product: true },
    });

    if (!bagComposition) {
      throw new NotFoundException(`BagComposition #${id} introuvable`);
    }

    return bagComposition;
  }

  async update(id: number, dto: UpdateBagCompositionDto) {
    await this.findOne(id);

    try {
      return response.json('this service allows to update bagCompo')
      // return await this.prisma.bagComposition.update({
      //   where: { id },
      //   data: {
      //     ...dto,
      //     date: dto.date ? new Date(dto.date) : undefined,
      //   },
      //   include: { site: true, product: true },
      // });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      return await this.prisma.bagComposition.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code?: string }).code;
      if (code === 'P2003') {
        throw new BadRequestException('siteId ou productId invalide');
      }
      if (code === 'P2025') {
        throw new NotFoundException('BagComposition introuvable');
      }
    }

    throw new InternalServerErrorException('Erreur sur BagComposition');
  }
}
