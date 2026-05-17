import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IVehicleCheckPayload } from '../../models/vehicle-check.model';
import { Component, computed, inject, OnInit } from '@angular/core';
import { IVehicleDto } from '../../models/vehicle.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgClass, DecimalPipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-vehicle-form-checklist',
    imports: [
        ReactiveFormsModule,
        InputNumberModule,
        CheckboxModule,
        TextareaModule,
        ButtonModule,
        NgClass,
        DecimalPipe,
    ],
    templateUrl: './vehicle-form-checklist.component.html',
    styleUrl: './vehicle-form-checklist.component.css',
})
export class VehicleFormChecklistComponent implements OnInit {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly ref = inject(DynamicDialogRef);
    private readonly config = inject(DynamicDialogConfig);

    public vehicle!: IVehicleDto;

    // Définition de la structure du formulaire (Correspond à IVehicleChecklistData)
    public checklistForm = this.fb.group({
        mileage: [0, [Validators.required]],
        checks: this.fb.group({
            engineOil: [false],
            coolant: [false],
            brakeFluid: [false],
            windshieldWasher: [false],
            tires: [false],
            lights: [false],
            siren: [false],
            bodywork: [false],
        }),
        observations: [''],
    });

    public totalChecks = 8;

    // Calcul réactif du nombre de cases cochées
    public completedChecksCount = computed(() => {
        const currentChecks = this.checklistForm.value.checks;
        if (!currentChecks) return 0;
        return Object.values(currentChecks).filter((val) => val).length;
    });

    ngOnInit() {
        if (this.config.data?.vehicle) {
            this.vehicle = this.config.data.vehicle;

            // J'applique ma règle RMC-02 : Le kilométrage ne peut pas reculer
            this.checklistForm.controls.mileage.setValue(this.vehicle.mileage);
            this.checklistForm.controls.mileage.setValidators([
                Validators.required,
                Validators.min(this.vehicle.mileage),
            ]);
        }
    }

    onSubmit() {
        if (this.checklistForm.invalid) {
            this.checklistForm.markAllAsTouched();
            return;
        }

        const formValue = this.checklistForm.getRawValue();

        // Typage strict : Je formate la payload selon mon interface ICreateVehicleCheckPayload
        const payload: IVehicleCheckPayload = {
            vehicleId: this.vehicle.id,
            mileageRecorded: formValue.mileage,
            checklistData: {
                engineOil: formValue.checks.engineOil,
                coolant: formValue.checks.coolant,
                brakeFluid: formValue.checks.brakeFluid,
                windshieldWasher: formValue.checks.windshieldWasher,
                tires: formValue.checks.tires,
                lights: formValue.checks.lights,
                siren: formValue.checks.siren,
                bodywork: formValue.checks.bodywork,
                observations: formValue.observations,
            },
        };

        // Je ferme la modale et j'envoie le payload structuré au composant parent (VehicleCard)
        this.ref.close(payload);
    }

    onCancel() {
        this.ref.close();
    }
}
