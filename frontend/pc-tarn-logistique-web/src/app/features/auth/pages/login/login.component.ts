import { FormLoginComponent } from '../../components/form-login/form-login.component';
import { Component } from '@angular/core';
import { ToggleDarkModeComponent } from '../../../../shared/components/toggle-dark-mode/toggle-dark-mode.component';

@Component({
    selector: 'app-login',
    imports: [FormLoginComponent, ToggleDarkModeComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {}
