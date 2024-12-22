import { TestBed } from '@angular/core/testing';

import { InitBDService } from './init-bd.service';

describe('InitBDService', () => {
  let service: InitBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
