import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingCenter } from './messaging-center';

describe('MessagingCenter', () => {
  let component: MessagingCenter;
  let fixture: ComponentFixture<MessagingCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagingCenter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagingCenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
