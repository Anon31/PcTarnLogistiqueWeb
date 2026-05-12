import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageCardWrapperComponent } from '../../../../shared/components/page-card-wrapper/page-card-wrapper.component';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';

@Component({
    selector: 'app-vehicle-tracking-home',
    imports: [PageCardWrapperComponent, VehicleCardComponent],
    templateUrl: './vehicle-tracking-home.component.html',
    styleUrl: './vehicle-tracking-home.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTrackingHomeComponent {}
