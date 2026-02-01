import { inject, Injectable } from '@angular/core';
import { IUser } from '../../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private httpClient = inject(HttpClient);
    private router = inject(Router);

    registerUser(user: Partial<IUser>) {
        return this.httpClient.post<IUser>(`${environment.API_URL}/users`, user);
    }
}
