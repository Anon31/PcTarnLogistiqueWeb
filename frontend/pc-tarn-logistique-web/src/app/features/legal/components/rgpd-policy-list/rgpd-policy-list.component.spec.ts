import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RgpdPolicyListComponent } from './rgpd-policy-list.component';

describe('RgpdPolicyListComponent', () => {
    let component: RgpdPolicyListComponent;
    let fixture: ComponentFixture<RgpdPolicyListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RgpdPolicyListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RgpdPolicyListComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
