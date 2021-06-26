import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributedgradientsComponent } from './contributedgradients.component';

describe('ContributedgradientsComponent', () => {
  let component: ContributedgradientsComponent;
  let fixture: ComponentFixture<ContributedgradientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributedgradientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributedgradientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
