import { VehicleService } from '../../services/vehicle.service';
import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-vehicle-card',
    imports: [Card, Button, DecimalPipe, Tag],
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.css',
})
export class VehicleCardComponent implements OnInit {
    vehicleService = inject(VehicleService);

    ngOnInit() {
        this.vehicleService.getAllVehicles();
    }

    /**
     * Retourne la sévérité PrimeNG pour le composant p-tag
     */
    getSeverity(status: string | undefined): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        switch (status) {
            case 'OPERATIONAL':
                return 'success';
            case 'WARNING':
                return 'warn';
            case 'NON_COMPLIANT':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Traduit l'énum backend en libellé français pour l'interface
     */
    getStatusLabel(status: string | undefined): string {
        switch (status) {
            case 'OPERATIONAL':
                return 'Opérationnel';
            case 'WARNING':
                return 'À surveiller';
            case 'NON_COMPLIANT':
                return 'Problème';
            default:
                return 'Inconnu';
        }
    }
}
