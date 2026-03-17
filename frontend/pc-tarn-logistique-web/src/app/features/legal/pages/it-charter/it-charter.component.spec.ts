import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItCharterComponent } from './it-charter.component';

describe('ItCharterComponent', () => {
  let component: ItCharterComponent;
  let fixture: ComponentFixture<ItCharterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItCharterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItCharterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
