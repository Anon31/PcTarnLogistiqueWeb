import { computed, Injectable, signal, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { IUser } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isAuthenticated = signal<boolean>(false);
    isAdmin = signal<boolean>(false);
    // Signal to hold the connected user information
    private userConnectedSignal = signal<IUser>({} as IUser);
    readonly userConnected = computed(() => this.userConnectedSignal());

    // Nouvelle méthode utilisant HttpClient directement (A voir..)
    // private user$ = this.http.get<User>('/api/me');
    // readonly currentUser = toSignal(this.user$);

    jwtToken: string = '';
    loggedUser: string = '';
    roles: string[] = [];

    private jwtHelperService = new JwtHelperService();
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    constructor() {
        this.loadToken();
    }

    registerUser(user: Partial<IUser>) {
        return this.httpClient.post<IUser>(`${environment.API_URL}/users`, user).pipe(
            tap((user: IUser) => {
                this.userConnectedSignal.set(user);
            }),
        );
    }

    login(credential: Partial<IUser>): Observable<HttpResponse<IUser>> {
        return this.httpClient
            .post<IUser>(`${environment.API_URL}/auth/login`, credential, { observe: 'response' })
            .pipe(
                tap((response: any) => {
                    const jwtToken = response.headers.get('Authorization')!;
                    this.saveToken(jwtToken);
                }),
            );
    }

    logout() {
        this.clearState();
        localStorage.removeItem('THEME');
        this.router.navigate(['/connexion']).then();
    }

    saveToken(jwt: string) {
        localStorage.setItem('JWT_TOKEN', jwt);
        this.jwtToken = jwt;
        this.isAuthenticated.set(true);
        this.decodeJwtToken();
    }

    decodeJwtToken() {
        if (this.jwtToken == undefined) return;

        const decodedToken = this.jwtHelperService.decodeToken(this.jwtToken);
        this.roles = decodedToken.roles;
        this.loggedUser = decodedToken.sub;

        if (this.roles.includes('ADMIN')) {
            this.isAdmin.set(true);
        }
    }

    getToken() {
        return this.jwtToken;
    }

    loadToken(): void {
        const token = localStorage.getItem('JWT_TOKEN');
        if (token && !this.jwtHelperService.isTokenExpired(token)) {
            this.jwtToken = token;
            this.isAuthenticated.set(true);
            this.decodeJwtToken();
        } else {
            this.clearState();
        }
    }

    isTokenExpired(): boolean {
        return this.jwtHelperService.isTokenExpired(this.jwtToken);
    }

    private clearState(): void {
        this.jwtToken = '';
        this.loggedUser = '';
        this.roles = [];
        this.isAuthenticated.set(false);
        this.isAdmin.set(false);
        localStorage.removeItem('JWT_TOKEN');
    }
}
