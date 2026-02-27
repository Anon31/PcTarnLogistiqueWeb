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
export class SystemService {
    /**
     * Retourne un objet centralisé contenant toutes les énumérations métier.
     * Cette méthode permet au frontend de mettre en cache ces données critiques dès le démarrage.
     */
    getReferenceData() {
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
