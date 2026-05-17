import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'vehicleStatusSeverity', standalone: true })
export class VehicleStatusSeverityPipe implements PipeTransform {
    transform(value: string | undefined): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        switch (value) {
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
}
