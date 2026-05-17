import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, inject } from '@angular/core';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-user-form-password',
    standalone: true,
    imports: [ReactiveFormsModule, Button, Password],
    templateUrl: './user-form-password.component.html',
})
export class UserFormPasswordComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly ref = inject(DynamicDialogRef);

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
