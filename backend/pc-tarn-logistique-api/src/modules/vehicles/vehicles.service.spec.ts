import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MockPrismaService, providePrismaMock } from '../../mocks/prisma-mock';

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

    describe('create', () => {
        it('doit créer un véhicule', async () => {
            const dto = {
                name: 'VL 02',
                type: 'VL' as any,
                licensePlate: 'AA-123-AA',
                status: 'OPERATIONAL' as any,
                siteId: 1,
            };

            prismaMock.vehicle.create.mockResolvedValue({ id: 1, ...dto } as any);

            const result = await service.create(dto as any);
            expect(prismaMock.vehicle.create).toHaveBeenCalledWith({ data: dto });
            expect(result.id).toEqual(1);
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
});
