import { IVehicleDto, IVehiclePayload } from '../models/vehicle.model';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    private readonly http = inject(HttpClient);

    // Le signal privé contient l'état brut des véhicules
    private readonly vehiclesSignal = signal<IVehicleDto[]>([]);

    // Le signal public en lecture seule pour les composants
    readonly vehicles = computed(() => this.vehiclesSignal());

    /**
     * Charge la liste des véhicules.
     * Je retourne l'Observable pour permettre au composant de réagir.
     */
    getAllVehicles(): Observable<IVehicleDto[]> {
        return this.http.get<IVehicleDto[]>(`${environment.API_URL}/vehicles`).pipe(
            tap((vehicles) => {
                this.vehiclesSignal.set(vehicles);
            }),
        );
    }

    /**
     * Récupère un véhicule par son ID (Idéal pour la page de détail)
     */
    getVehicleById(id: number): Observable<IVehicleDto> {
        return this.http.get<IVehicleDto>(`${environment.API_URL}/vehicles/${id}`);
    }

    /**
     * Création d'un nouveau véhicule (avec mise à jour optimiste du signal)
     */
    createVehicle(vehiclePayload: IVehiclePayload): Observable<IVehicleDto> {
        return this.http.post<IVehicleDto>(`${environment.API_URL}/vehicles`, vehiclePayload).pipe(
            tap((createdVehicle) => {
                // Mise à jour locale optimiste : on l'ajoute au début de la liste
                this.vehiclesSignal.update((vehicles) => [createdVehicle, ...vehicles]);
            }),
        );
    }

    /**
     * Mise à jour d'un véhicule (API + State Local)
     */
    patchVehicle(id: number, vehiclePayload: Partial<IVehiclePayload>): Observable<IVehicleDto> {
        return this.http
            .patch<IVehicleDto>(`${environment.API_URL}/vehicles/${id}`, vehiclePayload)
            .pipe(
                tap((updatedVehicle) => {
                    // Mise à jour locale du tableau
                    this.vehiclesSignal.update((vehicles) =>
                        vehicles.map((v) => (v.id === id ? { ...v, ...updatedVehicle } : v)),
                    );
                }),
            );
    }

    /**
     * Supprime un véhicule (API + State Local)
     */
    deleteVehicle(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.API_URL}/vehicles/${id}`).pipe(
            tap(() => {
                // Suppression locale instantanée
                this.vehiclesSignal.update((vehicles) => vehicles.filter((v) => v.id !== id));
            }),
        );
    }

    /**
     * Soumission d'une checklist de vérification (Règles Métier RMC-02 & RMC-03)
     * Met à jour le kilométrage et recalcule le statut localement après succès.
     */
    submitChecklist(vehicleId: number, checklistPayload: any): Observable<any> {
        return this.http
            .post<any>(`${environment.API_URL}/vehicles/${vehicleId}/checks`, checklistPayload)
            .pipe(
                tap((response) => {
                    this.vehiclesSignal.update((vehicles) =>
                        vehicles.map((v) => {
                            if (v.id === vehicleId) {
                                return {
                                    ...v,
                                    // Mise à jour instantanée du kilométrage
                                    mileage: checklistPayload.mileage,
                                    // Le backend me renvoie le nouveau statut calculé (RMC-03)
                                    status: response.newStatus || v.status,
                                };
                            }
                            return v;
                        }),
                    );
                }),
            );
    }
}
