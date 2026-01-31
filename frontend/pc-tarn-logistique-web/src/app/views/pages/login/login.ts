import { FormLogin } from '../../components/forms/form-login/form-login';
import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [FormLogin],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {}
