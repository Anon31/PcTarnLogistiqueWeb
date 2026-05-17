import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { VehicleService } from '../../services/vehicle.service';
import { IVehicleDto } from '../../models/vehicle.model';
import { VehicleFormChecklistComponent } from '../vehicle-form-checklist/vehicle-form-checklist.component';

// Import de mes nouveaux Pipes de performance
import { VehicleStatusSeverityPipe } from '../../pipes/vehicle-status-severity.pipe';
import { EnumsDynamicPipe } from '../../../../shared/pipes/enums-dynamic.pipe';

@Component({
    selector: 'app-vehicle-card',
    imports: [
        Card,
        Button,
        DecimalPipe,
        Tag,
        EnumsDynamicPipe,
        VehicleStatusSeverityPipe,
        DatePipe,
    ],
    providers: [DialogService],
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.css',
})
export class VehicleCardComponent implements OnInit, OnDestroy {
    private readonly dialogService = inject(DialogService);
    private readonly router = inject(Router);
    private dialogRef!: DynamicDialogRef<any> | null;
    private loadSub: Subscription | undefined;

    public vehicleService = inject(VehicleService);

    ngOnInit() {
        // JE M'ABONNE ICI : C'est ce qui déclenche l'appel API réel et fait réapparaître mes cartes
        this.loadSub = this.vehicleService.getAllVehicles().subscribe();
    }

    ngOnDestroy() {
        // Bonne pratique : j'évite les fuites de mémoire à la destruction du composant
        if (this.loadSub) this.loadSub.unsubscribe();
        if (this.dialogRef) this.dialogRef.close();
    }

    /**
     * Navigation vers le détail du véhicule avec son ID dynamique
     */
    navigateToDetail(vehicleId: number) {
        this.router.navigate(['/vehicules', vehicleId]);
    }

    /**
     * Ouverture de la modale dynamique en lui passant le contexte du véhicule
     */
    openChecklistDialog(vehicle: IVehicleDto) {
        this.dialogRef = this.dialogService.open(VehicleFormChecklistComponent, {
            header: `Vérification périodique - ${vehicle.name}`, // Titre dynamique
            width: '40rem',
            modal: true,
            data: { vehicle }, // 🔑 Je passe les données à la modale
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw',
            },
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
        });

        // Abonnement à la fermeture de la modale
        this.dialogRef?.onClose.subscribe((checklistPayload) => {
            if (checklistPayload) {
                // TODO: Appeler this.vehicleService.submitChecklist()
                console.log('Payload reçu de la modale :', checklistPayload);
            }
        });
    }
}
