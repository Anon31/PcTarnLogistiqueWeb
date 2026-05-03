import { VehicleService } from './vehicle.service';
import { TestBed } from '@angular/core/testing';

describe('VehicleService', () => {
    let service: VehicleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VehicleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
