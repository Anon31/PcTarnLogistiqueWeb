import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPasswordComponent } from './form-password.component';

describe('FormPasswordComponent', () => {
  let component: FormPasswordComponent;
  let fixture: ComponentFixture<FormPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
