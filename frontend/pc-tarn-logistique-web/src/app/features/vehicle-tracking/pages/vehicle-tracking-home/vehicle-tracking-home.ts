import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { CardVehicleComponent } from '../../components/card-vehicle/card-vehicle.component';

@Component({
    selector: 'app-vehicle-tracking-home',
    imports: [PageCardWrapperComponent, CardVehicleComponent],
    templateUrl: './vehicle-tracking-home.html',
    styleUrl: './vehicle-tracking-home.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTrackingHome {}
