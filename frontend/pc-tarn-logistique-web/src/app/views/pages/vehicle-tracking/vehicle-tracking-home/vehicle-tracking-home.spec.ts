import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrackingHome } from './vehicle-tracking-home';

describe('VehicleTrackingHome', () => {
  let component: VehicleTrackingHome;
  let fixture: ComponentFixture<VehicleTrackingHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTrackingHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTrackingHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
