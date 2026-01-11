import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleDarkMode } from './toggle-dark-mode';

describe('ToggleDarkMode', () => {
    let component: ToggleDarkMode;
    let fixture: ComponentFixture<ToggleDarkMode>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ToggleDarkMode],
        }).compileComponents();

        fixture = TestBed.createComponent(ToggleDarkMode);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
