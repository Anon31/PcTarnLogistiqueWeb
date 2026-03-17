import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditingComponent } from './user-editing.component';

describe('UserEditingComponent', () => {
  let component: UserEditingComponent;
  let fixture: ComponentFixture<UserEditingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
