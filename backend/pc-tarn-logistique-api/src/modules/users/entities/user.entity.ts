import { ApiProperty } from '@nestjs/swagger';
import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

/**
 * Classe représentant un utilisateur dans l'application. Elle implémente l'interface User définie par Prisma.
 * Cette classe est utilisée pour structurer les données des utilisateurs et contrôler la sérialisation JSON,
 * notamment en excluant le mot de passe des réponses API pour des raisons de sécurité.
 */
export class UserEntity implements User {
    @ApiProperty({ description: "Identifiant unique de l'utilisateur", example: 1 })
    id: number;

    @ApiProperty({ description: "Prénom de l'utilisateur", example: 'Jean' })
    firstname: string;

    @ApiProperty({ description: "Nom de famille de l'utilisateur", example: 'Dupont' })
    lastname: string;

    @ApiProperty({ description: 'Adresse email (unique)', example: 'jean.dupont@croix-rouge.fr' })
    email: string;

    @Exclude() // 👈 Directive de sécurité absolue : exclut la propriété du JSON de retour
    password: string;

    @ApiProperty({ required: false, description: 'Numéro de téléphone', example: '+33612345678' })
    phone: string | null;

    @ApiProperty({ required: false, description: 'Date de naissance', example: '1990-05-15T00:00:00.000Z' })
    birthdate: Date | null;

    @ApiProperty({ description: "Statut d'activation du compte", example: true })
    enabled: boolean;

    @ApiProperty({ enum: Role, description: "Rôle d'accès au système", example: Role.BENEVOLE })
    role: Role;

    @ApiProperty({ description: "Date de création de l'enregistrement" })
    createdAt: Date;

    @ApiProperty({ description: 'Date de dernière modification' })
    updatedAt: Date;

    @ApiProperty({ required: false, description: "Identifiant de l'antenne de rattachement", example: 1 })
    siteId: number | null; // 👈 Clé étrangère obligatoire

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
