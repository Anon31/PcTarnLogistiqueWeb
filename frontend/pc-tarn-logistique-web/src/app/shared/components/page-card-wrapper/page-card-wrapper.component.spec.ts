import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCardWrapperComponent } from './page-card-wrapper.component';

describe('PageCardWrapperComponent', () => {
    let component: PageCardWrapperComponent;
    let fixture: ComponentFixture<PageCardWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageCardWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PageCardWrapperComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
