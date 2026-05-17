import { VehicleStatusSeverityPipe } from './vehicle-status-severity.pipe';

describe('VehicleStatusSeverityPipe', () => {
    it('create an instance', () => {
        const pipe = new VehicleStatusSeverityPipe();
        expect(pipe).toBeTruthy();
    });
});
