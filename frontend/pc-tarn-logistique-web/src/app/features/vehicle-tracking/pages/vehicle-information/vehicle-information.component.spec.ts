import { VehicleInformationComponent } from './vehicle-information.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('VehicleInformationComponent', () => {
    let component: VehicleInformationComponent;
    let fixture: ComponentFixture<VehicleInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VehicleInformationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(VehicleInformationComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
