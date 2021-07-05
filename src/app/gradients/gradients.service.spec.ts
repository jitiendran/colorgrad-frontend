import { TestBed } from '@angular/core/testing';

import { GradientsService } from './gradients.service';

describe('GradientsService', () => {
  let service: GradientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
