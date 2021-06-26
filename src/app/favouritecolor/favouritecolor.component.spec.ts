import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritecolorComponent } from './favouritecolor.component';

describe('FavouritecolorComponent', () => {
  let component: FavouritecolorComponent;
  let fixture: ComponentFixture<FavouritecolorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouritecolorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritecolorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
