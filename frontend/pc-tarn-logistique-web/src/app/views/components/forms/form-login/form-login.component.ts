import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../../core/services/toaster.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { StyleClass } from 'primeng/styleclass';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-form-login',
    standalone: true,
    imports: [ReactiveFormsModule, Button, FloatLabel, InputText, StyleClass],
    templateUrl: './form-login.component.html',
    styleUrl: './form-login.component.css',
})
export class FormLoginComponent {
    private fb = inject(NonNullableFormBuilder);
    private authService = inject(AuthService);
    private toastService = inject(ToasterService);
    private router = inject(Router);

    // Initialisation directe du formulaire (Typage strict garanti)
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    /**
     * Soumission du formulaire de connexion
     */
    submitForm() {
        // Vérification avec markAllAsTouched pour forcer l'affichage des erreurs UI
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        // Extraction propre des données fortement typées ({email: string, password: string})
        const payload = this.loginForm.getRawValue();

        this.authService.login(payload).subscribe({
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
}
