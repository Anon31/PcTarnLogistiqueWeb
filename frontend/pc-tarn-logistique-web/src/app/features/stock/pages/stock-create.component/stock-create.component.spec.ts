import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCreateComponent } from './stock-create.component';

describe('StockCreateComponent', () => {
  let component: StockCreateComponent;
  let fixture: ComponentFixture<StockCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
