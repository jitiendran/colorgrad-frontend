import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributedcolorsComponent } from './contributedcolors.component';

describe('ContributedcolorsComponent', () => {
  let component: ContributedcolorsComponent;
  let fixture: ComponentFixture<ContributedcolorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributedcolorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributedcolorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
