import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { ToasterService } from './toaster.service';
import { MessageService } from 'primeng/api';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToasterService, MessageService],
        });
        service = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
