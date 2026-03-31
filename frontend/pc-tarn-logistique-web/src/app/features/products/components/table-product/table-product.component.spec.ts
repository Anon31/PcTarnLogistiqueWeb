import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableProductComponent } from './table-product.component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TableProductComponent', () => {
    let component: TableProductComponent;
    let fixture: ComponentFixture<TableProductComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableProductComponent],
            providers: [
                ToasterService,
                ConfirmationService,
                MessageService,
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TableProductComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
