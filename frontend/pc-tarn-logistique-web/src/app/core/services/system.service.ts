import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemStatus } from '../models/system-status.model';

@Injectable({
    providedIn: 'root',
})
export class SystemService {
    private apiUrl = `${environment.API_URL}/system`; // ex: http://localhost:3000/api/v1/system

    constructor(private http: HttpClient) {}

    /**
     * Récupère le statut de sécurité du Backend.
     */
    getSystemStatus(): Observable<SystemStatus> {
        return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
    }
}
