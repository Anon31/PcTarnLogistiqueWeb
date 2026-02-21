import { Injectable } from '@nestjs/common';
import {
    Role,
    ItemCategory,
    Condition,
    VehicleStatus,
    BagStatus,
    CheckType,
    ReportStatus,
    ReportUrgency,
    TypeMovement,
    VehicleType,
    SiteType,
    BatchStatus,
} from '@prisma/client';

@Injectable()
export class EnumsService {
    /**
     * Retourne un objet contenant toutes les énumérations du système
     */
    getEnums() {
        return {
            roles: Role,
            itemCategories: ItemCategory,
            conditions: Condition,
            vehicleStatuses: VehicleStatus,
            bagStatuses: BagStatus,
            checkTypes: CheckType,
            reportStatuses: ReportStatus,
            reportUrgencies: ReportUrgency,
            typeMovements: TypeMovement,
            vehicleTypes: VehicleType,
            siteTypes: SiteType,
            batchStatuses: BatchStatus,
        };
    }
}
