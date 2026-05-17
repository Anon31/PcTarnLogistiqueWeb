import { EnumsDataService } from '../../core/enums/services/enums-data.service';
import { EnumReferenceData } from '../../core/enums/models/enums.models';
import { Pipe, PipeTransform, inject } from '@angular/core';

/**
 * Traduit dynamiquement n'importe quelle énumération en priorisant les traductions françaises locales.
 */
@Pipe({
    name: 'enumsDynamic',
    standalone: true,
})
export class EnumsDynamicPipe implements PipeTransform {
    private readonly enumsDataService = inject(EnumsDataService);

    // Dictionnaire de traductions locales (Prioritaire)
    private readonly fallbackTranslations: Record<string, string> = {
        // Rôles
        ADMIN: 'Administrateur',
        MANAGER: 'Manager',
        BENEVOLE: 'Bénévole',

        // Catégories
        BILAN: 'Bilan',
        TRAUMA: 'Traumatologie',
        PLAIE: 'Plaies & Brûlures',
        HYGIENE: 'Hygiène & Protection',
        MALAISE: 'Malaise',
        OXY: 'Oxygénothérapie',
        KITS: 'Kits Spécifiques',
        FORMATION: 'Matériel de Formation',
        LOGISTIQUE: 'Matériel Logistique',

        // État du matériel
        BON: 'Bon état',
        MOYEN: 'État moyen',
        A_CHANGER: 'À remplacer',
        HS: 'Hors Service',

        // Statuts des véhicules
        OPERATIONAL: 'Opérationnel',
        WARNING: 'À surveiller',
        NON_COMPLIANT: 'Non Conforme',

        // Statuts des sacs
        DISPONIBLE: 'Disponible',
        NON_OPERATIONNEL: 'Non Opérationnel',

        // Types de contrôle
        DEPARTURE: 'Départ',
        RETURN: 'Retour',
        PERIODIC: 'Périodique',

        // Statuts des signalements
        NEW: 'Nouveau',
        IN_PROGRESS: 'En cours',
        RESOLVED: 'Résolu',

        // Urgences
        LOW: 'Faible',
        MEDIUM: 'Moyenne',
        CRITICAL: 'Critique',

        // Mouvements de stock
        INPUT: 'Entrée',
        OUTPUT: 'Sortie',

        // Types de véhicules
        VL: 'Véhicule Léger',
        VPSP: 'VPSP',
        VTU: 'Véhicule Toutes Utilités',

        // Types de sites
        INDOOR: 'Intérieur',
        OUTDOOR: 'Extérieur',

        // Statuts des lots
        VALID: 'Valide',
        QUARANTINE: 'En Quarantaine',
        RECALLED: 'Rappelé',
    };

    transform(value: string | null | undefined, enumCategory?: keyof EnumReferenceData): string {
        if (!value) return '';

        // 1. PRIORITÉ au dictionnaire local pour assurer un bel affichage en français
        if (this.fallbackTranslations[value]) {
            return this.fallbackTranslations[value];
        }

        // 2. BACKEND FALLBACK : Si le mot n'est pas dans le dictionnaire local, on regarde ce que dit le backend
        const enums = this.enumsDataService.enumsData();
        if (enums && enumCategory && enums[enumCategory]?.[value]) {
            return enums[enumCategory][value];
        }

        // 3. Fallback final de sécurité : on normalise la valeur brute
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replaceAll('_', ' ');
    }
}
