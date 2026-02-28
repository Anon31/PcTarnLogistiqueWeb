import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Crée un nouvel utilisateur dans la base de données. Le mot de passe est automatiquement haché avant d'être stocké.
     * Si une adresse est fournie, elle est créée en même temps que l'utilisateur grâce à la relation Prisma.
     * @param dto
     */
    async create(dto: CreateUserDto) {
        const { email, password, address, birthdate, role, ...rest } = dto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Plus de try/catch répétitif ! Le Filtre Global s'occupe de l'erreur P2002.
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

        // L'entité s'occupe de masquer le mot de passe automatiquement.
        return new UserEntity(newUser);
    }

    /**
     * Récupère tous les utilisateurs de la base de données, incluant leurs adresses. Les utilisateurs sont triés par ID croissant pour une lecture plus intuitive.
     */
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: { address: true },
            orderBy: { id: 'asc' },
        });
        return users.map((user) => new UserEntity(user));
    }

    /**
     * Trouve un utilisateur par son ID. Si l'utilisateur n'existe pas, une exception NotFoundException est levée.
     * @param id
     */
    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { address: true },
        });
        if (!user) throw new NotFoundException(`Utilisateur #${id} introuvable`);
        return new UserEntity(user);
    }

    /**
     * Méthode utilitaire pour trouver un utilisateur par son email. Utile notamment pour l'authentification.
     * @param email
     */
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    /**
     * Met à jour un utilisateur dans la base de données. Avant de mettre à jour, on vérifie que l'utilisateur existe pour éviter une erreur non gérée.
     * @param id
     * @param dto
     */
    async update(id: number, dto: UpdateUserDto) {
        await this.findOne(id); // Vérifie que l'utilisateur existe

        const { password, address, birthdate, ...rest } = dto;
        const dataToUpdate: any = { ...rest };

        if (password) {
            const salt = await bcrypt.genSalt();
            dataToUpdate.password = await bcrypt.hash(password, salt);
        }
        if (birthdate) dataToUpdate.birthdate = new Date(birthdate);

        if (address) {
            dataToUpdate.address = {
                upsert: { create: { ...address }, update: { ...address } },
            };
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: dataToUpdate,
            include: { address: true },
        });

        return new UserEntity(updatedUser);
    }

    /**
     * Supprime un utilisateur de la base de données. Avant de supprimer, on vérifie que l'utilisateur existe pour éviter une erreur non gérée.
     * @param id
     */
    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }

    /**
     * Met à jour le mot de passe d'un utilisateur. Cette méthode est utilisée par l'endpoint PATCH /users/me/password.
     * @param userId
     * @param dto
     */
    async updatePassword(userId: number, dto: UpdatePasswordDto) {
        // On récupère l'utilisateur incluant son mot de passe actuel depuis la base
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');

        // On vérifie si l'ancien mot de passe saisi correspond au hash en base
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("L'ancien mot de passe est incorrect.");
        }

        // On hache le nouveau mot de passe et on sauvegarde
        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(dto.newPassword, salt);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Mot de passe mis à jour avec succès' };
    }
}
