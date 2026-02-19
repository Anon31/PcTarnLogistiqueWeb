import { Injectable } from '@nestjs/common';
// Import direct depuis le client Prisma pour garantir la synchro BDD <-> API
import { Role, ItemCategory, Condition, VehicleStatus, LotStatus, CheckType, ReportStatus, ReportUrgency } from '@prisma/client';

@Injectable()
export class EnumsService {
    getEnums() {
        return {
            roles: Role,
            itemCategories: ItemCategory,
            conditions: Condition,
            vehicleStatuses: VehicleStatus,
            lotStatuses: LotStatus,
            checkTypes: CheckType,
            reportStatuses: ReportStatus,
            reportUrgencies: ReportUrgency,
        };
    }
}
