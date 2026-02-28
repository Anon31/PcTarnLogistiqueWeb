import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { NotFoundException } from '@nestjs/common';

describe('VehiclesService', () => {
    let service: VehiclesService;
    let prismaMock: MockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VehiclesService,
                providePrismaMock(), // Injection du bouchon Prisma global configuré précédemment
            ],
        }).compile();

        service = module.get<VehiclesService>(VehiclesService);
        // Cast indispensable pour dire à TypeScript que prismaMock possède les fonctions de jest (mockResolvedValue, etc)
        prismaMock = module.get(PrismaService) as unknown as MockPrismaService;
    });

    it('doit être défini', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('doit créer un véhicule', async () => {
            const dto = {
                name: 'VL 02',
                type: 'VL' as any,
                licensePlate: 'AA-123-AA',
                mileage: 15000,
                status: 'OPERATIONAL' as any,
                siteId: 1,
            };

            prismaMock.vehicle.create.mockResolvedValue({ id: 1, ...dto } as any);

            const result = await service.create(dto as any);
            expect(prismaMock.vehicle.create).toHaveBeenCalledWith({ data: dto });
            expect(result.id).toEqual(1);
            expect(result.mileage).toEqual(15000);
        });
    });

    describe('findAll', () => {
        it('doit retourner un tableau de véhicules', async () => {
            const mockVehicles = [
                { id: 1, name: 'Ambulance 01' },
                { id: 2, name: 'VPSP 02' },
            ];
            prismaMock.vehicle.findMany.mockResolvedValue(mockVehicles as any);

            const result = await service.findAll();
            expect(prismaMock.vehicle.findMany).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });
    });

    describe('findOne', () => {
        it("doit retourner un véhicule si l'ID existe", async () => {
            const mockVehicle = { id: 1, name: 'VPSP 01' };

            // On ordonne au mock de Prisma de retourner notre faux objet
            prismaMock.vehicle.findUnique.mockResolvedValue(mockVehicle as any);

            const result = await service.findOne(1);

            // Vérification que la méthode a bien été appelée avec les bons arguments
            expect(prismaMock.vehicle.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result.name).toEqual('VPSP 01');
        });

        it("doit lever une NotFoundException si le véhicule n'existe pas", async () => {
            // Prisma retourne null si l'enregistrement n'existe pas en BDD
            prismaMock.vehicle.findUnique.mockResolvedValue(null as any);

            // On vérifie que notre service intercepte ce null et le transforme en Exception HTTP 404
            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it("doit mettre à jour le véhicule si l'ID existe", async () => {
            const mockVehicle = { id: 1, name: 'Ancien Nom', mileage: 10000 };
            const dto = { name: 'Nouveau Nom', mileage: 10500 };

            // L'update fait d'abord un findOne, il faut donc mocker les deux !
            prismaMock.vehicle.findUnique.mockResolvedValue(mockVehicle as any);
            prismaMock.vehicle.update.mockResolvedValue({ ...mockVehicle, ...dto } as any);

            const result = await service.update(1, dto);

            expect(prismaMock.vehicle.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
            expect(result.name).toEqual('Nouveau Nom');
            expect(result.mileage).toEqual(10500);
        });
    });

    describe('remove', () => {
        it("doit supprimer le véhicule si l'ID existe", async () => {
            const mockVehicle = { id: 1, name: 'VPSP à supprimer' };

            // La méthode remove() appelle findOne() en premier. Il faut donc mocker les deux méthodes.
            prismaMock.vehicle.findUnique.mockResolvedValue(mockVehicle as any);
            prismaMock.vehicle.delete.mockResolvedValue(mockVehicle as any);

            const result = await service.remove(1);

            expect(prismaMock.vehicle.findUnique).toHaveBeenCalled();
            expect(prismaMock.vehicle.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result.id).toEqual(1);
        });
    });

    describe('findAllBags', () => {
        it('doit retourner les sacs liés au véhicule (bouchon temporaire)', async () => {
            const mockVehicle = { id: 1, name: 'VPSP 01' };

            // Vérifie que le véhicule existe bien avant d'essayer de lister ses sacs
            prismaMock.vehicle.findUnique.mockResolvedValue(mockVehicle as any);

            const result = (await service.findAllBags(1)) as any;

            expect(prismaMock.vehicle.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result.message).toContain('1');
            expect(result.datas).toEqual([]);
        });
    });
});
