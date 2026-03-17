import { IAuthUser, ILoginDto, ILoginPayload } from '../../features/auth/models/login.model';
import { computed, Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private jwtHelperService = new JwtHelperService();
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    // --- STATE (SIGNALS) ---
    // Le signal privé contient l'état brut (token et user)
    private tokenSignal = signal<string | null>(null);
    // Le signal public en lecture seule pour les composants
    private userConnectedSignal = signal<IAuthUser | null>(null);
    // --- COMPUTED (DÉDUCTIONS) ---
    readonly isAuthenticated = computed(() => {
        const token = this.tokenSignal();
        // Un utilisateur est considéré comme authentifié si un token existe et n'est pas expiré
        return !!token && !this.jwtHelperService.isTokenExpired(token);
    });
    // On expose les données de l'utilisateur connecté pour les composants
    readonly userConnected = computed(() => this.userConnectedSignal());

    constructor() {
        this.loadToken();
    }

    /**
     * Effectue la requête de login et gère la réponse pour stocker le token et les infos utilisateur.
     * @param payload
     */
    login(payload: ILoginPayload): Observable<HttpResponse<ILoginDto>> {
        return this.httpClient
            .post<ILoginDto>(`${environment.API_URL}/auth/login`, payload, {
                observe: 'response',
            })
            .pipe(
                tap((response: HttpResponse<ILoginDto>) => {
                    const body = response.body;

                    if (body && body.access_token) {
                        this.saveToken(body.access_token);
                        if (body.user) {
                            this.userConnectedSignal.set(body.user);
                            localStorage.setItem('USER_DATA', JSON.stringify(body.user));
                        }
                    }
                }),
            );
    }

    /**
     * Déconnecte l'utilisateur en nettoyant le token, les infos utilisateur et en redirigeant vers la page de connexion.
     */
    logout() {
        this.clearState();
        // localStorage.removeItem('THEME');
        this.router.navigate(['/connexion']).then();
    }

    /**
     * Stocke le token dans le localStorage et met à jour le signal.
     * @param jwt
     */
    saveToken(jwt: string) {
        localStorage.setItem('JWT_TOKEN', jwt);
        this.tokenSignal.set(jwt);
    }

    /**
     * Récupère le token actuel depuis le signal (ou null s'il n'y en a pas).
     */
    getToken(): string | null {
        return this.tokenSignal();
    }

    /**
     * Charge le token et les infos utilisateur depuis le localStorage au démarrage de l'application.
     */
    loadToken(): void {
        const token = localStorage.getItem('JWT_TOKEN');
        const userStr = localStorage.getItem('USER_DATA');

        if (token && !this.jwtHelperService.isTokenExpired(token)) {
            this.tokenSignal.set(token);
            if (userStr) {
                try {
                    this.userConnectedSignal.set(JSON.parse(userStr));
                } catch (e) {
                    console.error('Erreur parsing user data', e);
                }
            }
        } else {
            this.clearState();
        }
    }

    /**
     * Vérifie si le token est expiré ou non. Retourne true si le token est absent ou expiré, sinon false.
     */
    isTokenExpired(): boolean {
        const token = this.tokenSignal();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    /**
     * Nettoie le token et les données utilisateur du localStorage et réinitialise les signaux.
     * @private
     */
    private clearState(): void {
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('USER_DATA');
        this.tokenSignal.set(null);
        this.userConnectedSignal.set(null);
    }
}
