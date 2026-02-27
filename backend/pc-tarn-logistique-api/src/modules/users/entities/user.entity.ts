import { ApiProperty } from '@nestjs/swagger';
import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

/**
 * Classe représentant un utilisateur dans l'application. Elle implémente l'interface User définie par Prisma.
 * Cette classe est utilisée pour structurer les données des utilisateurs et contrôler la sérialisation JSON,
 * notamment en excluant le mot de passe des réponses API pour des raisons de sécurité.
 */
export class UserEntity implements User {
    @ApiProperty() id: number;
    @ApiProperty() firstname: string;
    @ApiProperty() lastname: string;
    @ApiProperty() email: string;

    @Exclude() // 👈 Directive de sécurité absolue : exclut la propriété du JSON de retour
    password: string;

    @ApiProperty({ required: false }) phone: string | null;
    @ApiProperty({ required: false }) birthdate: Date | null;
    @ApiProperty() enabled: boolean;
    @ApiProperty({ enum: Role }) role: Role;
    @ApiProperty() createdAt: Date;
    @ApiProperty() updatedAt: Date;
    @ApiProperty({ required: false }) siteId: number | null;

    /**
     * Constructeur de la classe UserEntity. Il prend un objet partiel de type UserEntity
     * et assigne ses propriétés à l'instance courante. Cela permet de créer facilement des
     * instances de UserEntity à partir d'objets partiels, par exemple lors de la récupération
     * de données depuis la base de données.
     * @param partial
     */
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
