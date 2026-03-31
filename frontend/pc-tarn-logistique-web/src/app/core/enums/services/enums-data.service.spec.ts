import { TestBed } from '@angular/core/testing';

import { EnumsDataService } from './enums-data.service';

describe('EnumsDataService', () => {
    let service: EnumsDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EnumsDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
