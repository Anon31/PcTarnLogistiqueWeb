import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserDto) {
        // 1. Extraction des données
        const { email, password, address, birthdate, role, ...rest } = dto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    ...rest,
                    email,
                    password: hashedPassword,
                    birthdate: birthdate ? new Date(birthdate) : undefined,
                    enabled: true,
                    role: role,
                    address: address ? { create: { ...address } } : undefined,
                },
                include: { address: true },
            });

            const { password: _, ...result } = newUser;
            return result;
        } catch (error) {
            if (error.code === 'P2002') throw new ConflictException('Email déjà utilisé');
            console.error(error);
            throw new InternalServerErrorException('Erreur création utilisateur');
        }
    }

    findAll() {
        return this.prisma.user.findMany({
            include: { address: true },
            orderBy: { id: 'asc' },
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { address: true },
        });
        if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async update(id: number, dto: UpdateUserDto) {
        await this.findOne(id);

        const { password, address, birthdate, ...rest } = dto;
        const dataToUpdate: any = { ...rest };

        if (password) {
            const salt = await bcrypt.genSalt();
            dataToUpdate.password = await bcrypt.hash(password, salt);
        }

        if (birthdate) {
            dataToUpdate.birthdate = new Date(birthdate);
        }

        if (address) {
            dataToUpdate.address = {
                upsert: {
                    create: { ...address },
                    update: { ...address },
                },
            };
        }

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: dataToUpdate,
                include: { address: true },
            });

            const { password: _, ...result } = updatedUser;
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Erreur lors de la mise à jour');
        }
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
