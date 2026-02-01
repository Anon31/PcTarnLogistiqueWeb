import { IUserDto, IUserPayload } from '../../shared/interfaces/user';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    /**
     * Création d'un nouvel utilisateur
     * @param user
     */
    createUser(user: IUserPayload) {
        return this.httpClient.post<IUserDto>(`${environment.API_URL}/users`, user).pipe(
            tap((createdUser: IUserDto) => {
                // Logique optionnelle post-inscription (ex: auto-login)
                console.log('🚀 Utilisateur créé avec succès:', createdUser);
            }),
        );
    }

    getUserById(userId: number) {
        return this.httpClient.get<IUserDto>(`${environment.API_URL}/users/${userId}`);
    }

    getUserByEmail(email: string) {
        return this.httpClient.get<IUserDto>(`${environment.API_URL}/users/email/${email}`);
    }

    getAllUsers() {
        return this.httpClient.get<IUserDto[]>(`${environment.API_URL}/users`);
    }

    updateUser(userId: string, user: Partial<IUserPayload>) {
        return this.httpClient.put<IUserDto>(`${environment.API_URL}/users/${userId}`, user).pipe(
            tap((updatedUser: IUserDto) => {
                console.log('🚀 Utilisateur mis à jour avec succès:', updatedUser);
            }),
        );
    }

    deleteUser(userId: string) {
        return this.httpClient.delete<void>(`${environment.API_URL}/users/${userId}`).pipe(
            tap(() => {
                console.log('🚀 Utilisateur supprimé avec succès');
            }),
        );
    }
}
