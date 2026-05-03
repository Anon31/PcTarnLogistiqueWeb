import { ItCharterListComponent } from './it-charter-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ItCharterListComponent', () => {
    let component: ItCharterListComponent;
    let fixture: ComponentFixture<ItCharterListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItCharterListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ItCharterListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
