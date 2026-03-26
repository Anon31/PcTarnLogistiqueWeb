import { ToasterService } from '../../../../core/services/toaster.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableUserComponent } from './table-user.component';

describe('TableUserComponent', () => {
    let component: TableUserComponent;
    let fixture: ComponentFixture<TableUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableUserComponent],
            providers: [
                ToasterService,
                ConfirmationService,
                MessageService,
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TableUserComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
