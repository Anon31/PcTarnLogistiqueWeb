import { IUserDto, IUserPayload } from '../../shared/interfaces/user';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToasterService } from './toaster.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
    private toaster = inject(ToasterService);

    // Le signal privé contient l'état brut
    private usersSignal = signal<IUserDto[]>([]);
    // Le signal public en lecture seule pour les composants
    readonly users = computed(() => this.usersSignal());

    /**
     * Charge les utilisateurs et met à jour le signal.
     * Le composant n'a pas besoin de subscribe, juste d'appeler cette méthode.
     */
    getAllUsers(): void {
        this.http
            .get<IUserDto[]>(`${environment.API_URL}/users`)
            .pipe(
                tap((users) => this.usersSignal.set(users)),
                catchError((err) => {
                    console.error('Erreur chargement users', err);
                    this.toaster.error(
                        'Tous nos utilisateurs',
                        'Une erreur est survenue lors de la récupération des utilisateurs',
                    );
                    return throwError(() => err);
                }),
            )
            .subscribe();
    }

    /**
     * Création d'un nouvel utilisateur
     * @param user
     */
    createUser(user: IUserPayload) {
        console.log('Creating user:', user);
        // return this.http.post<IUserDto>(`${environment.API_URL}/users`, user).pipe(
        //     tap((createdUser: IUserDto) => {
        //         // Logique optionnelle post-inscription (ex: auto-login)
        //         console.log('🚀 Utilisateur créé avec succès:', createdUser);
        //     }),
        // );
    }

    getUserById(userId: number) {
        return this.http.get<IUserDto>(`${environment.API_URL}/users/${userId}`);
    }

    getUserByEmail(email: string) {
        return this.http.get<IUserDto>(`${environment.API_URL}/users/email/${email}`);
    }

    /**
     * Met à jour un utilisateur (API + State Local)
     */
    patchUser(id: number, user: Partial<IUserPayload>): Observable<IUserDto> {
        return this.http.patch<IUserDto>(`${environment.API_URL}/users/${id}`, user).pipe(
            tap((updatedUser) => {
                // Mise à jour locale optimiste du tableau
                this.usersSignal.update((users) =>
                    users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
                );
                console.log('🚀 Utilisateur mis à jour avec succès:', updatedUser);
            }),
        );
    }

    /**
     * Supprime un utilisateur (API + State Local)
     */
    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.API_URL}/users/${id}`).pipe(
            tap(() => {
                // Suppression locale instantanée
                this.usersSignal.update((users) => users.filter((u) => u.id !== id));
                console.log('🚀 Utilisateur supprimé avec succès');
            }),
        );
    }
}
