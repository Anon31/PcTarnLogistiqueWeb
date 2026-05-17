import { ToasterService } from '../../../../core/services/toaster.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserTableComponent } from './user-table.component';

describe('UserTableComponent', () => {
    let component: UserTableComponent;
    let fixture: ComponentFixture<UserTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserTableComponent],
            providers: [
                ToasterService,
                ConfirmationService,
                MessageService,
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserTableComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
