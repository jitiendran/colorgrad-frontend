import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupModelComponent } from './signup-model.component';

describe('SignupModelComponent', () => {
  let component: SignupModelComponent;
  let fixture: ComponentFixture<SignupModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
