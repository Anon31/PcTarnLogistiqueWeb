import { EnumReferenceData } from '../../../core/enums/models/enums.models';

export interface IVehicleDto {
    id: number;
    type: string;
    name: string;
    licensePlate: string;
    mileage: number;
    status: EnumReferenceData['vehicleStatuses'][string]; // Pointe vers les valeurs dynamiques chargées par le backend
    siteId: number;
    nextTechnicalCheck: string; // ISO Date string
}

/**
 * Ce qui est envoyé via le formulaire.
 */
export type IVehiclePayload = Omit<IVehicleDto, 'id'>;
