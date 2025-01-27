import { TestBed } from '@angular/core/testing';

import { BodyMaidService } from './body-maid.service';

describe('BodyMaidService', () => {
  let service: BodyMaidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyMaidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
