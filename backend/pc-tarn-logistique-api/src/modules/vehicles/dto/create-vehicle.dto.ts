import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { VehicleType, VehicleStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
    @ApiProperty({ description: "Nom d'usage du véhicule", example: 'Ambulance 01' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: VehicleType, description: 'Catégorie du véhicule', example: VehicleType.VPSP })
    @IsEnum(VehicleType, { message: 'Le type doit être une valeur valide (VL, VPSP, VTU)' })
    @IsNotEmpty()
    type: VehicleType;

    @ApiProperty({ description: "Plaque d'immatriculation", example: 'AB-123-CD' })
    @IsString()
    @IsNotEmpty()
    licensePlate: string;

    /**
     * Relevé kilométrique obligatoire à la création du véhicule.
     * Le décorateur @Min(0) empêche la saisie d'un kilométrage négatif.
     */
    @ApiProperty({ description: 'Kilométrage initial du véhicule', example: 45000 })
    @IsInt({ message: 'Le kilométrage doit être un nombre entier' })
    @Min(0, { message: 'Le kilométrage ne peut pas être négatif' })
    @IsNotEmpty()
    mileage: number;

    @ApiProperty({ enum: VehicleStatus, description: 'État de fonctionnement actuel', example: VehicleStatus.OPERATIONAL })
    @IsEnum(VehicleStatus, { message: 'Le statut doit être valide (ex: OPERATIONAL)' })
    @IsNotEmpty()
    status: VehicleStatus;

    /**
     * L'identifiant de l'antenne est obligatoire.
     * Règle métier : Un véhicule ne peut pas exister sans être rattaché à une base physique.
     */
    @ApiProperty({ description: "ID de l'antenne (site) de rattachement", example: 1 })
    @IsInt()
    @IsNotEmpty()
    siteId: number;
}
