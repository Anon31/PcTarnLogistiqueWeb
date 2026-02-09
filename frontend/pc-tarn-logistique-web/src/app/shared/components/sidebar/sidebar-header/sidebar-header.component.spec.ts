import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarHeaderComponent } from './sidebar-header.component';

describe('SidebarHeaderComponent', () => {
    let component: SidebarHeaderComponent;
    let fixture: ComponentFixture<SidebarHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SidebarHeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SidebarHeaderComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
