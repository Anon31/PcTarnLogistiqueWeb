import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrettyJson } from './pretty-json';

describe('PrettyJson', () => {
  let component: PrettyJson;
  let fixture: ComponentFixture<PrettyJson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrettyJson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrettyJson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
