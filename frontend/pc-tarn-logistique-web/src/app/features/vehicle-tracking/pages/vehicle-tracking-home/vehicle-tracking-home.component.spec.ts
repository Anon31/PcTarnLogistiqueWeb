import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrackingHomeComponent } from './vehicle-tracking-home.component';

describe('VehicleTrackingHomeComponent', () => {
    let component: VehicleTrackingHomeComponent;
    let fixture: ComponentFixture<VehicleTrackingHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VehicleTrackingHomeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleTrackingHomeComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
