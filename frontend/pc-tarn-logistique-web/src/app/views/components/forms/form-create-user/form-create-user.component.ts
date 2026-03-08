import { minimumAgeValidator } from '../../../../shared/validators/minimum-age-validator';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumsDataService } from '../../../../core/enums/services/enums-data.service';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
import { ToasterService } from '../../../../core/services/toaster.service';
import { Component, inject, computed, DestroyRef } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { IUserPayload } from '../../../../shared/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-form-create-user',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        SelectModule,
        ButtonModule,
        DividerModule,
        NgClass,
    ],
    providers: [EnumsDynamicPipe],
    templateUrl: './form-create-user.component.html',
    styleUrl: './form-create-user.component.css',
})
export class FormCreateUserComponent {
    // Injection des dépendances (approche moderne Angular 14+)
    private fb = inject(NonNullableFormBuilder);
    private enumsPipe = inject(EnumsDynamicPipe);
    private enumsData = inject(EnumsDataService);
    private toaster = inject(ToasterService);
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    // Chargement dynamique des rôles via un Signal calculé (réagit automatiquement aux changements du backend)
    rolesOptions = computed(() => {
        const backendRoles = this.enumsData.enumsData()?.roles || {};
        return Object.values(backendRoles).map((roleValue) => ({
            label: this.enumsPipe.transform(roleValue as string),
            value: roleValue,
        }));
    });

    sitesOptions = [
        { label: "Antenne d'Albi", value: 1 },
        { label: 'Antenne de Castres', value: 2 },
    ];

    // Création du formulaire avec Nested FormGroup (Groupe imbriqué)
    userForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
        birthdate: ['', [Validators.required, minimumAgeValidator(16)]],
        role: ['', [Validators.required]],
        siteId: [1, [Validators.required]],
        address: this.fb.group({
            number: [null as number | null, [Validators.min(1)]],
            street: [''],
            zipcode: [''],
            city: [''],
            state: ['France'],
        }),
    });

    /**
     * Soumission du formulaire
     */
    onSubmit() {
        // Arrêt immédiat si le formulaire contient des erreurs
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched(); // Force l'affichage du texte rouge sous les champs vides
            this.toaster.error('Formulaire incomplet', 'Veuillez vérifier les champs en rouge.');
            return;
        }

        const formValue = this.userForm.getRawValue();

        // Construction stricte du Payload envoyé au backend (correspond à l'interface IUserPayload)
        const payload: IUserPayload = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            password: formValue.password,
            email: formValue.email,
            phone: formValue.phone || '',
            birthdate: formValue.birthdate,
            role: formValue.role,
            siteId: formValue.siteId,
            address: {
                number: formValue.address.number ? Number(formValue.address.number) : 0,
                street: formValue.address.street || '',
                zipcode: formValue.address.zipcode || '',
                city: formValue.address.city || '',
                state: formValue.address.state || 'France',
            },
        };

        // Appel au service HTTP
        this.userService
            .createUser(payload)
            .pipe(takeUntilDestroyed(this.destroyRef)) // Désinscription automatique (prévention des fuites mémoire)
            .subscribe({
                next: (newUser) => {
                    // J'utilise .then() pour m'assurer que la redirection de la promesse est terminée
                    // avant d'afficher le Toaster, pour une expérience utilisateur plus fluide.
                    this.router.navigate(['/utilisateurs/rechercher']).then(() => {
                        this.toaster.success(
                            'Utilisateur créé !',
                            `${newUser.firstname} a été ajouté avec succès.`,
                        );
                    });
                },
                // L'affichage du toaster d'erreur est géré automatiquement par notre ErrorInterceptor global
                error: (err) => console.error('Erreur lors de la création :', err),
            });
    }

    onCancel() {
        // Résolution de la promesse de navigation pour éviter l'erreur de "floating-promise"
        this.router.navigate(['/utilisateurs/rechercher']).then();
    }
}
