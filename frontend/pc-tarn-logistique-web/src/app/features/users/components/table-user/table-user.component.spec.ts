import { ToasterService } from '../../../../core/services/toaster.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableUserComponent } from './table-user.component';
import { MessageService } from 'primeng/api';

describe('TableUserComponent', () => {
    let component: TableUserComponent;
    let fixture: ComponentFixture<TableUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableUserComponent],
            providers: [ToasterService, MessageService, provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(TableUserComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
