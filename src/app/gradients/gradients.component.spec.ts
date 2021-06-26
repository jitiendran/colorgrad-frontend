import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradientsComponent } from './gradients.component';

describe('GradientsComponent', () => {
  let component: GradientsComponent;
  let fixture: ComponentFixture<GradientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
