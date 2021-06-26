import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritegradientComponent } from './favouritegradient.component';

describe('FavouritegradientComponent', () => {
  let component: FavouritegradientComponent;
  let fixture: ComponentFixture<FavouritegradientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouritegradientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritegradientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
