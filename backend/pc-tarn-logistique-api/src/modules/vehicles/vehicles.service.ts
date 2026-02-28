import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleEntity } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateVehicleDto) {
        // Le Filtre Global Prisma s'occupera d'intercepter automatiquement
        // les potentielles erreurs (ex: Plaque d'immatriculation en doublon).
        const vehicle = await this.prisma.vehicle.create({
            data: dto,
        });
        return new VehicleEntity(vehicle);
    }

    async findAll() {
        const vehicles = await this.prisma.vehicle.findMany({
            orderBy: { id: 'asc' },
        });
        return vehicles.map((v) => new VehicleEntity(v));
    }

    async findOne(id: number) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });

        // Règle de bonne pratique : Toujours lever une exception HTTP claire
        // si la ressource demandée n'existe pas.
        if (!vehicle) throw new NotFoundException(`Véhicule #${id} introuvable`);

        return new VehicleEntity(vehicle);
    }

    async update(id: number, dto: UpdateVehicleDto) {
        // En appelant d'abord findOne(), on s'assure que le véhicule existe
        // avant d'essayer de le modifier, ce qui garantit que l'exception 404 est bien gérée.
        await this.findOne(id);

        const updatedVehicle = await this.prisma.vehicle.update({
            where: { id },
            data: dto,
        });
        return new VehicleEntity(updatedVehicle);
    }

    async remove(id: number) {
        await this.findOne(id);

        const deletedVehicle = await this.prisma.vehicle.delete({
            where: { id },
        });
        return new VehicleEntity(deletedVehicle);
    }

    /**
     * Méthode préparatoire pour les futures relations (ex: BagComposition).
     * @param id_vehicle
     */
    async findAllBags(id_vehicle: number) {
        // On vérifie que le véhicule cible existe bien
        await this.findOne(id_vehicle);

        return {
            message: `This action list all lots in vehicle ${id_vehicle}`,
            datas: [],
        };
    }
}
