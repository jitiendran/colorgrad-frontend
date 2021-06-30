import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGradientsComponent } from './user-gradients.component';

describe('UserGradientsComponent', () => {
  let component: UserGradientsComponent;
  let fixture: ComponentFixture<UserGradientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGradientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGradientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
