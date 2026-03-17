import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpdPolicyComponent } from './rgpd-policy.component';

describe('RgpdPolicyComponent', () => {
  let component: RgpdPolicyComponent;
  let fixture: ComponentFixture<RgpdPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgpdPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RgpdPolicyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
