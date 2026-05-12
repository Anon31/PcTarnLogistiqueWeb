import { VehicleChecklistComponent } from './vehicle-checklist.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VehicleChecklistComponent', () => {
    let component: VehicleChecklistComponent;
    let fixture: ComponentFixture<VehicleChecklistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VehicleChecklistComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleChecklistComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
