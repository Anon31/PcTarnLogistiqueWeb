import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const { email, password, firstname, lastname, address, phone, birthDate } = createUserDto;

        // 1. Hacher le mot de passe
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            // 2. Créer l'utilisateur avec ses relations
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstname,
                    lastname,
                    phone,
                    // Conversion de la string date en objet Date si présent
                    birthDate: birthDate ? new Date(birthDate) : undefined,

                    enabled: true, // Ou false si validation requise plus tard
                    // Rôle par défaut : BENEVOLE
                    roles: {
                        connectOrCreate: {
                            where: { name: 'BENEVOLE' },
                            create: { name: 'BENEVOLE' },
                        },
                    },
                    address: address
                        ? {
                              create: { ...address },
                          }
                        : undefined,
                },
                // On inclut les relations pour le retour API
                include: {
                    roles: true,
                    address: true,
                },
            });

            // 3. Nettoyer le retour (Retirer le mot de passe)
            const { password: _, ...result } = newUser;
            return result;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Cet email est déjà utilisé');
            }
            throw new InternalServerErrorException("Erreur lors de la création de l'utilisateur");
        }
    }

    findAll() {
        return this.prisma.user.findMany({ include: { roles: true } });
    }

    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { roles: true, address: true },
        });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
