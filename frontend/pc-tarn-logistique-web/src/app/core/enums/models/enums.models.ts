export interface EnumReferenceData {
    roles: Record<string, string>; // Record : clé = valeur de l'énumération, valeur = libellé à afficher
    itemCategories: Record<string, string>;
    conditions: Record<string, string>;
    vehicleStatuses: Record<string, string>;
    bagStatuses: Record<string, string>;
    checkTypes: Record<string, string>;
    reportStatuses: Record<string, string>;
    reportUrgencies: Record<string, string>;
    typeMovements: Record<string, string>;
    vehicleTypes: Record<string, string>;
    siteTypes: Record<string, string>;
    batchStatuses: Record<string, string>;
}
