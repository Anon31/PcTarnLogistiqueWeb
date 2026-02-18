import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchControlListComponent } from './batch-control-list.component';

describe('BatchControlListComponent', () => {
  let component: BatchControlListComponent;
  let fixture: ComponentFixture<BatchControlListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchControlListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchControlListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
