import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-vehicle-form-checklist',
    imports: [Button, ReactiveFormsModule, InputNumber],
    templateUrl: './vehicle-form-checklist.component.html',
    styleUrl: './vehicle-form-checklist.component.css',
})
export class VehicleFormChecklistComponent {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly ref = inject(DynamicDialogRef);

    checklistForm = this.fb.group({
        mileage: '',
    });

    onSubmit() {
        if (this.checklistForm.invalid) {
            this.checklistForm.markAllAsTouched();
            return;
        }

        // On ferme la modale en renvoyant le DTO au composant parent
        this.ref.close(this.checklistForm.getRawValue());
    }

    onCancel() {
        this.ref.close();
    }
}
