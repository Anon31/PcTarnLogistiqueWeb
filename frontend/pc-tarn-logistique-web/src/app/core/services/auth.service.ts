import { computed, Injectable, signal, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IAuthUser, ILoginDto, ILoginPayload } from '../../shared/interfaces/login';
import { IUserDto, IUserPayload } from '../../shared/interfaces/user';

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
    readonly isAdmin = computed(() => this.rolesSignal().includes('ADMIN'));

    // Exposition publique de l'utilisateur connecté
    readonly userConnected = computed(() => this.userConnectedSignal());

    constructor() {
        this.loadToken();
    }

    // Inscription
    // On peut utiliser Partial<IUser> ici ou créer un IRegisterPayload spécifique plus tard
    registerUser(user: IUserPayload) {
        return this.httpClient.post<IUserDto>(`${environment.API_URL}/users`, user).pipe(
            tap((createdUser: IUserDto) => {
                // Logique optionnelle post-inscription (ex: auto-login)
                console.log('Utilisateur créé avec succès:', createdUser);
            }),
        );
    }

    // Connexion
    // Utilisation stricte de ILoginPayload (entrée) et ILoginDto (sortie)
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
                        }
                    }
                }),
            );
    }

    logout() {
        this.clearState();
        localStorage.removeItem('THEME');
        this.router.navigate(['/connexion']).then();
    }

    // --- GESTION DU TOKEN ---

    saveToken(jwt: string) {
        localStorage.setItem('JWT_TOKEN', jwt);
        this.tokenSignal.set(jwt);
        this.decodeJwtToken(jwt);
    }

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

    getToken(): string | null {
        return this.tokenSignal();
    }

    // Chargement initial au démarrage de l'app
    loadToken(): void {
        const token = localStorage.getItem('JWT_TOKEN');

        if (token && !this.jwtHelperService.isTokenExpired(token)) {
            this.tokenSignal.set(token);
            this.decodeJwtToken(token);
            // Note: userConnectedSignal restera null au F5 tant qu'on ne refait pas un appel /me
            // ou qu'on ne stocke pas le user dans le localStorage aussi.
        } else {
            this.clearState();
        }
    }

    isTokenExpired(): boolean {
        const token = this.tokenSignal();
        return !token || this.jwtHelperService.isTokenExpired(token);
    }

    private clearState(): void {
        localStorage.removeItem('JWT_TOKEN');
        this.tokenSignal.set(null);
        this.userConnectedSignal.set(null);
        this.rolesSignal.set([]);
    }
}
