import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBase } from '../../../../shared/class/form-base';
import { Component, inject, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { StyleClass } from 'primeng/styleclass';
import { InputText } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-form-login',
    imports: [Button, FloatLabel, InputText, ReactiveFormsModule, StyleClass],
    templateUrl: './form-login.component.html',
    styleUrl: './form-login.component.css',
})
export class FormLoginComponent extends FormBase implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToasterService);
    private router = inject(Router);

    constructor() {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    submitForm() {
        if (this.form.invalid) return;

        this.authService.login(this.form.value).subscribe({
            next: (response) => {
                this.router.navigate(['/', 'tableau-de-bord']).then(() => {
                    this.toastService.success(
                        `Bonjour ${response.body?.user.firstname}.`,
                        `🌿 Bienvenue dans votre application.`,
                    );
                });
            },
            error: (error) => {
                this.toastService.error('💥 Accès refusé', '🐞 Vérifiez vos informations.');
            },
        });
    }

    buildForm() {
        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
}
