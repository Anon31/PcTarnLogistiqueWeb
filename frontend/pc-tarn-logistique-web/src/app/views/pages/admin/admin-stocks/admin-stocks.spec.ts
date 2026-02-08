import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStocks } from './admin-stocks';

describe('AdminStocks', () => {
  let component: AdminStocks;
  let fixture: ComponentFixture<AdminStocks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStocks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStocks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
