import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IVehicleDto } from '../models/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    private http = inject(HttpClient);
    // Le signal privé contient l'état brut
    private vehiclesSignal = signal<IVehicleDto[]>([]);
    // Le signal public en lecture seule pour les composants
    readonly vehicles = computed(() => this.vehiclesSignal());

    /**
     * Charge les véhicules et met à jour le signal.
     * Le composant n'a pas besoin de subscribe, juste d'appeler cette méthode.
     */
    getAllVehicles(): void {
        this.http
            .get<IVehicleDto[]>(`${environment.API_URL}/vehicles`)
            .pipe(tap((vehicles) => this.vehiclesSignal.set(vehicles)))
            .subscribe();
    }
}
