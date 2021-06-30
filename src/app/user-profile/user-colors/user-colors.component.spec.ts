import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserColorsComponent } from './user-colors.component';

describe('UserColorsComponent', () => {
  let component: UserColorsComponent;
  let fixture: ComponentFixture<UserColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
