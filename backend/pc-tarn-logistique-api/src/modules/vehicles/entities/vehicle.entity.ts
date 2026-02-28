import { Vehicle, VehicleType, VehicleStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleEntity implements Vehicle {
    @ApiProperty({ description: 'Identifiant unique du véhicule', example: 1 })
    id: number;

    @ApiProperty({ enum: VehicleType, description: 'Catégorie du véhicule', example: VehicleType.VPSP })
    type: VehicleType;

    @ApiProperty({ description: "Nom d'usage du véhicule", example: 'Ambulance 01' })
    name: string;

    @ApiProperty({ description: "Plaque d'immatriculation", example: 'AB-123-CD' })
    licensePlate: string;

    @ApiProperty({ description: 'Kilométrage actuel du véhicule', example: 45000 })
    mileage: number;

    @ApiProperty({ enum: VehicleStatus, description: 'État de fonctionnement actuel', example: VehicleStatus.OPERATIONAL })
    status: VehicleStatus;

    @ApiProperty({ description: "ID de l'antenne (site) de rattachement", example: 1 })
    siteId: number;

    /**
     * Constructeur d'hydratation.
     * Permet de transformer l'objet brut retourné par Prisma en une véritable instance de classe.
     * Indispensable pour que le ClassSerializerInterceptor fonctionne si l'on ajoute des @Exclude() plus tard.
     */
    constructor(partial: Partial<VehicleEntity>) {
        Object.assign(this, partial);
    }
}
