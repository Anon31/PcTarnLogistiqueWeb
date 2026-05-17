import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Component } from '@angular/core';
import { ToggleDarkModeComponent } from '../../../../shared/components/toggle-dark-mode/toggle-dark-mode.component';

@Component({
    selector: 'app-login',
    imports: [LoginFormComponent, ToggleDarkModeComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {}
