import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // --- CREATE ---
    async create(dto: CreateUserDto) {
        const { email, password, address, birthDate, ...rest } = dto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    ...rest,
                    email,
                    password: hashedPassword,
                    birthDate: birthDate ? new Date(birthDate) : undefined,
                    enabled: true,
                    roles: {
                        connectOrCreate: {
                            where: { name: 'BENEVOLE' },
                            create: { name: 'BENEVOLE' },
                        },
                    },
                    address: address ? { create: { ...address } } : undefined,
                },
                include: { roles: true, address: true },
            });

            const { password: _, ...result } = newUser;
            return result;
        } catch (error) {
            if (error.code === 'P2002') throw new ConflictException('Email déjà utilisé');
            throw new InternalServerErrorException('Erreur création utilisateur');
        }
    }

    // --- FIND ALL ---
    findAll() {
        return this.prisma.user.findMany({
            include: { roles: true, address: true },
            orderBy: { id: 'asc' },
        });
    }

    // --- FIND ONE ---
    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { roles: true, address: true },
        });
        if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
        return user;
    }

    // --- FIND BY EMAIL ---
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { roles: true },
        });
    }

    // --- UPDATE ---
    async update(id: number, dto: UpdateUserDto) {
        // Vérifier si l'utilisateur existe
        await this.findOne(id);

        const { password, address, birthDate, ...rest } = dto;
        const dataToUpdate: any = { ...rest };

        // Si un mot de passe est fourni, on le hache
        if (password) {
            const salt = await bcrypt.genSalt();
            dataToUpdate.password = await bcrypt.hash(password, salt);
        }

        // Gestion de la date
        if (birthDate) {
            dataToUpdate.birthDate = new Date(birthDate);
        }

        // Gestion de l'adresse (Upsert : Met à jour ou Crée si n'existe pas)
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
                include: { roles: true, address: true },
            });

            const { password: _, ...result } = updatedUser;
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Erreur lors de la mise à jour');
        }
    }

    // --- DELETE ---
    async remove(id: number) {
        await this.findOne(id); // Vérifie l'existence
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
