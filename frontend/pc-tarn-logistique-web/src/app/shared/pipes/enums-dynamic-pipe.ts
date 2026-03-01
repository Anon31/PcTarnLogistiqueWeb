import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'enumsDynamic',
    standalone: true,
})
export class EnumsDynamicPipe implements PipeTransform {
    // Dictionnaire de traduction exhaustif basé sur les données du backend
    private translations: Record<string, string> = {
        // Rôles
        ADMIN: 'Administrateur',
        MANAGER: 'Manager',
        BENEVOLE: 'Bénévole',

        // Catégories (itemCategories)
        BILAN: 'Bilan',
        TRAUMA: 'Traumatologie',
        PLAIE: 'Plaies et Brûlures',
        HYGIENE: 'Hygiène et Protection',
        MALAISE: 'Malaise',
        OXY: 'Oxygénothérapie',
        KITS: 'Kits Spécifiques',
        FORMATION: 'Matériel de Formation',
        LOGISTIQUE: 'Matériel Logistique',

        // État du matériel (conditions)
        BON: 'Bon état',
        MOYEN: 'État moyen',
        A_CHANGER: 'À remplacer',
        HS: 'Hors Service',

        // Statuts des véhicules (vehicleStatuses)
        OPERATIONAL: 'Opérationnel',
        WARNING: 'Avertissement',
        NON_COMPLIANT: 'Non Conforme',

        // Statuts des sacs (bagStatuses)
        DISPONIBLE: 'Disponible',
        NON_OPERATIONNEL: 'Non Opérationnel',

        // Types de contrôle (checkTypes)
        DEPARTURE: 'Départ',
        RETURN: 'Retour',
        PERIODIC: 'Périodique',

        // Statuts des signalements (reportStatuses)
        NEW: 'Nouveau',
        IN_PROGRESS: 'En cours',
        RESOLVED: 'Résolu',

        // Urgences (reportUrgencies)
        LOW: 'Faible',
        MEDIUM: 'Moyenne',
        CRITICAL: 'Critique',

        // Mouvements de stock (typeMovements)
        INPUT: 'Entrée',
        OUTPUT: 'Sortie',

        // Types de véhicules (vehicleTypes)
        VL: 'Véhicule Léger',
        VPSP: 'VPSP', // Véhicule de Premiers Secours à Personnes
        VTU: 'Véhicule Tout Usage',

        // Types de sites (siteTypes)
        INDOOR: 'Intérieur',
        OUTDOOR: 'Extérieur',

        // Statuts des lots de produits (batchStatuses)
        VALID: 'Valide',
        QUARANTINE: 'En Quarantaine',
        RECALLED: 'Rappelé',
    };

    transform(value: string | null | undefined): string {
        if (!value) return '';

        // Si on a une traduction française locale, on l'utilise
        if (this.translations[value]) {
            return this.translations[value];
        }

        // Fallback de sécurité : on affiche la valeur du backend en normalisant (ex: "EN_REPARATION" -> "En reparation")
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, ' ');
    }
}
