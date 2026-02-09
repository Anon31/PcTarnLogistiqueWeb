import { FormLoginComponent } from '../../components/forms/form-login/form-login.component';
import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [FormLoginComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {}
