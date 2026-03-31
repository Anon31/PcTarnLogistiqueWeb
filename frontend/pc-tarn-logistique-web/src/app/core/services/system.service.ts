import { environment } from '../../../environments/environment';
import { SystemStatus } from '../models/system-status.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SystemService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/system`; // ex: http://localhost:3000/api/v1/system

    /**
     * Récupère le statut de sécurité du Backend.
     */
    getSystemStatus(): Observable<SystemStatus> {
        return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
    }
}
