import { minimumAgeValidator } from '../../../../shared/validators/minimum-age-validator';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumsDataService } from '../../../../core/enums/services/enums-data.service';
import { Component, inject, computed, effect, input, output } from '@angular/core';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic-pipe';
import { IUserDto, IUserPayload } from '../../models/user.model';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { NgClass } from '@angular/common';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';

export type UserFormMode = 'create' | 'edit-admin' | 'edit-self';

@Component({
    selector: 'app-form-user',
    standalone: true,
    imports: [ReactiveFormsModule, Button, Divider, Password, InputText, Select, NgClass],
    providers: [EnumsDynamicPipe],
    templateUrl: './form-user.component.html',
})
export class FormUserComponent {
    private fb = inject(NonNullableFormBuilder);
    private enumsPipe = inject(EnumsDynamicPipe);
    private enumsData = inject(EnumsDataService);

    // 🚀 SIGNALS INPUTS
    mode = input<UserFormMode>('create');
    userData = input<IUserDto | null>(null);

    // 🚀 SIGNALS OUTPUTS
    save = output<IUserPayload>();
    cancelClick = output<void>();
    requestPasswordChange = output<void>(); // Événement pour demander l'ouverture de la modale

    rolesOptions = computed(() => {
        const backendRoles = this.enumsData.enumsData()?.roles || {};
        return Object.values(backendRoles).map((roleValue) => ({
            label: this.enumsPipe.transform(roleValue),
            value: roleValue,
        }));
    });

    sitesOptions = [
        { label: "Antenne d'Albi", value: 1 },
        { label: 'Antenne de Castres', value: 2 },
    ];

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

    constructor() {
        effect(() => {
            const user = this.userData();
            const currentMode = this.mode();

            if (user) {
                const formattedDate = user.birthdate
                    ? new Date(user.birthdate).toISOString().split('T')[0]
                    : '';

                this.userForm.patchValue({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    phone: user.phone || '',
                    birthdate: formattedDate,
                    role: user.role,
                    siteId: user.siteId,
                    address: {
                        number: user.address?.number || null,
                        street: user.address?.street || '',
                        zipcode: user.address?.zipcode || '',
                        city: user.address?.city || '',
                        state: user.address?.state || 'France',
                    },
                });

                // Le mot de passe n'est pas requis si on n'est pas en création
                if (currentMode !== 'create') {
                    this.userForm.controls.password.clearValidators();
                    this.userForm.controls.password.updateValueAndValidity();
                }

                // 🔒 Verrouillage des champs critiques en mode "Mon Compte"
                if (currentMode === 'edit-self') {
                    this.userForm.controls.firstname.disable();
                    this.userForm.controls.lastname.disable();
                    this.userForm.controls.email.disable();
                    this.userForm.controls.birthdate.disable();
                    this.userForm.controls.password.disable();
                } else {
                    this.userForm.controls.firstname.enable();
                    this.userForm.controls.lastname.enable();
                    this.userForm.controls.email.enable();
                    this.userForm.controls.birthdate.enable();
                    this.userForm.controls.password.enable();
                }
            }
        });
    }

    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const formValue = this.userForm.getRawValue();

        const payload: IUserPayload = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            email: formValue.email,
            password: formValue.password ? formValue.password : (undefined as any),
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

        this.save.emit(payload);
    }
}
