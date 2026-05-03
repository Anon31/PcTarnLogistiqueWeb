import { EnumReferenceData } from '../../../core/enums/models/enums.models';

/**
 * Ce que l'API nous renvoie après un get user réussi.
 */
export interface IVehicleDto {
    id: number;
    type: string;
    name: string;
    licensePlate: string;
    mileage: number;
    status: EnumReferenceData['vehicleStatuses'][string];
    siteId: number;
}

/**
 * Ce qui est envoyé via le formulaire.
 */
export type IVehiclePayload = Omit<IVehicleDto, 'id'>;
