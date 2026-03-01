import { IUserDto, IUserPayload } from '../../shared/interfaces/user';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
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
            .pipe(tap((users) => this.usersSignal.set(users)))
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

    /**
     * Récupère un utilisateur par son ID
     * @param userId
     */
    getUserById(userId: number) {
        return this.http.get<IUserDto>(`${environment.API_URL}/users/${userId}`);
    }

    /**
     * Récupère un utilisateur par son email
     * @param email
     */
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

    /**
     * En cas d'erreur lors de la mise à jour, on peut faire un rollback local pour restaurer l'état précédent.
     * Cela peut être appelé depuis le composant en cas d'erreur de l'API.
     * @param index
     * @param originalUser
     */
    rollbackUserUpdate(index: number, originalUser: IUserDto) {
        this.usersSignal.update((users) => {
            const newUsers = [...users]; // Création d'une nouvelle référence (Immutabilité)
            newUsers[index] = originalUser;
            return newUsers;
        });
    }
}
