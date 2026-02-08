import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchControl } from './batch-control';

describe('BatchControl', () => {
  let component: BatchControl;
  let fixture: ComponentFixture<BatchControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
