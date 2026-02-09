import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchControlComponent } from './batch-control.component';

describe('BatchControlComponent', () => {
  let component: BatchControlComponent;
  let fixture: ComponentFixture<BatchControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchControlComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
