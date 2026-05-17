/**
 * Structure stricte du JSONB qui sera stocké en base de données.
 */
export interface IVehicleChecklistData {
    engineOil: boolean; // Niveau d'huile moteur
    coolant: boolean; // Niveau du liquide de refroidissement
    brakeFluid: boolean; // Niveau du liquide de frein
    windshieldWasher: boolean; // Niveau du lave-glace
    tires: boolean; // État des pneumatiques (usure et pression)
    lights: boolean; // Fonctionnement des feux (avant, arrière, stop, clignotants)
    siren: boolean; // Fonctionnement du gyrophare et de l'avertisseur sonore
    bodywork: boolean; // État de la carrosserie (rayures, chocs)
    observations?: string; // Observations particulières (Champ texte optionnel)
}

/**
 * Payload global envoyé à l'API lors de la soumission (POST).
 */
export interface IVehicleCheckPayload {
    vehicleId: number;
    mileageRecorded: number; // Historisation kilométrique (RMC-02)
    checklistData: IVehicleChecklistData; // Le fameux champ JSONB de notre architecture
}
