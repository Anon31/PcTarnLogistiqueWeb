import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject } from '@angular/core';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-form-password',
    standalone: true,
    imports: [ReactiveFormsModule, Button, Password],
    templateUrl: './form-password.component.html',
})
export class FormPasswordComponent {
    private fb = inject(NonNullableFormBuilder);
    private ref = inject(DynamicDialogRef);

    passwordForm = this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    onSubmit() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        // On ferme la modale en renvoyant le DTO au composant parent
        this.ref.close(this.passwordForm.getRawValue());
    }

    onCancel() {
        this.ref.close();
    }
}
