import { VehicleFormChecklistComponent } from './vehicle-form-checklist.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VehicleFormChecklistComponent', () => {
    let component: VehicleFormChecklistComponent;
    let fixture: ComponentFixture<VehicleFormChecklistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VehicleFormChecklistComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleFormChecklistComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
