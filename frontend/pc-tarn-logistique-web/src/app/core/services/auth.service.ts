import { IAuthUser, ILoginDto, ILoginPayload } from '../../shared/interfaces/login';
import { computed, Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { EnumRolesName } from '../../shared/enums/roles.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private jwtHelperService = new JwtHelperService();
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    // --- STATE (SIGNALS) ---
    // Le token est la source de vérité pour l'état de connexion
    private tokenSignal = signal<string | null>(null);
    // On type avec IAuthUser (l'utilisateur connecté) ou null
    private userConnectedSignal = signal<IAuthUser | null>(null);
    // Les rôles sont extraits du token pour un accès rapide
    private rolesSignal = signal<string[]>([]);

    // --- COMPUTED VALUES (Lecture seule pour les composants) ---

    // isAuthenticated est automatiquement recalculé si le token change
    readonly isAuthenticated = computed(() => {
        const token = this.tokenSignal();
        return !!token && !this.jwtHelperService.isTokenExpired(token);
    });
    // isAdmin vérifie la présence du rôle dans le signal des rôles
    readonly isAdmin = computed(() => this.rolesSignal().includes(EnumRolesName.ADMIN));
    // Exposition publique de l'utilisateur connecté
    readonly userConnected = computed(() => this.userConnectedSignal());

    constructor() {
        this.loadToken();
    }

    /**
     * Connexion de l'utilisateur
     * Utilisation stricte de ILoginPayload (entrée) et ILoginDto (sortie)
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
                        // 1. Sauvegarde du token (déclenche isAuthenticated)
                        this.saveToken(body.access_token);
                        // 2. Mise à jour du signal utilisateur avec les données reçues
                        if (body.user) {
                            this.userConnectedSignal.set(body.user);
                            // Persister l'utilisateur
                            localStorage.setItem('USER_DATA', JSON.stringify(body.user));

                            console.log('🚀 this.userConnected() :', this.userConnected());
                            console.log('🚀 this.isAdmin() :', this.isAdmin());
                        }
                    }
                }),
            );
    }

    /**
     * Déconnexion de l'utilisateur
     */
    logout() {
        this.clearState();
        localStorage.removeItem('THEME');
        this.router.navigate(['/connexion']).then();
    }

    // --- GESTION DU TOKEN ---

    /**
     * Sauvegarde du token JWT dans le localStorage et mise à jour des signaux
     * @param jwt
     */
    saveToken(jwt: string) {
        localStorage.setItem('JWT_TOKEN', jwt);
        this.tokenSignal.set(jwt);
        this.decodeJwtToken(jwt);
    }

    /**
     * Décodage du token JWT pour extraire les rôles et autres infos
     * @param token
     * @private
     */
    private decodeJwtToken(token: string) {
        try {
            const decodedToken = this.jwtHelperService.decodeToken(token);
            if (decodedToken) {
                const roles = decodedToken.roles || [];
                this.rolesSignal.set(roles);
                // Si besoin, extraire d'autres infos du token ici
            }
        } catch (error) {
            console.error('Erreur décodage token:', error);
            this.logout();
        }
    }

    /**
     * Récupération du token JWT actuel
     */
    getToken(): string | null {
        return this.tokenSignal();
    }

    /**
     * Chargement du token depuis le localStorage au démarrage de l'application
     */
    loadToken(): void {
        const token = localStorage.getItem('JWT_TOKEN');
        const userStr = localStorage.getItem('USER_DATA'); // AJOUT : Récupérer le user stocké

        if (token && !this.jwtHelperService.isTokenExpired(token)) {
            this.tokenSignal.set(token);
            this.decodeJwtToken(token);
            // Note : userConnectedSignal restera null au F5 tant qu'on ne refait pas un appel /me
            // ou qu'on ne stocke pas l'user dans le localStorage aussi.
            // AJOUT : Restaurer le signal utilisateur si présent
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
     * Vérifie si le token est expiré
     */
    isTokenExpired(): boolean {
        const token = this.tokenSignal();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    /**
     * Réinitialisation de l'état d'authentification
     * @private
     */
    private clearState(): void {
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('USER_DATA');
        this.tokenSignal.set(null);
        this.userConnectedSignal.set(null);
        this.rolesSignal.set([]);
    }
}
