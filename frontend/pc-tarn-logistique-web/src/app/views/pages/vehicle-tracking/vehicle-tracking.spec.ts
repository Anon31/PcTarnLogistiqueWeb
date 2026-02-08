import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTracking } from './vehicle-tracking';

describe('VehicleTracking', () => {
  let component: VehicleTracking;
  let fixture: ComponentFixture<VehicleTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTracking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
