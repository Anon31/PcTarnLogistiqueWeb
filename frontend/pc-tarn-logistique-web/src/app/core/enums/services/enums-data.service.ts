import { environment } from '../../../../environments/environment';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { EnumReferenceData } from '../models/enums.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class EnumsDataService {
    private http = inject(HttpClient);

    // Signal privé contenant l'état brut
    private enumsDataSignal = signal<EnumReferenceData | null>(null);
    // Signal public en lecture seule
    readonly enumsData = this.enumsDataSignal.asReadonly();

    /**
     * Appelé uniquement au démarrage de l'application.
     * Récupère tous les dictionnaires métier du backend.
     */
    loadReferenceData(): Observable<void> {
        return this.http
            .get<EnumReferenceData>(`${environment.API_URL}/system/reference-data`)
            .pipe(
                tap((data) => {
                    console.log('✅ Enums chargés:', data);
                    this.enumsDataSignal.set(data);
                }),
                map(() => void 0), // L'APP_INITIALIZER a besoin d'un Observable<void>
                catchError((err) => {
                    console.error('❌ Erreur critique : Impossible de charger les enums', err);
                    return of(void 0);
                }),
            );
    }
}
