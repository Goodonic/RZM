import { TestBed } from '@angular/core/testing';

import { NOMService } from './nom.service';

describe('NOMService', () => {
  let service: NOMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NOMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
