import { TestBed } from '@angular/core/testing';

import { PodgroupService } from './podgroup.service';

describe('PodgroupService', () => {
  let service: PodgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
