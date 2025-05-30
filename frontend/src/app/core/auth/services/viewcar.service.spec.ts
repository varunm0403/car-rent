import { TestBed } from '@angular/core/testing';

import { ViewcarService } from './viewcar.service';

describe('ViewcarService', () => {
  let service: ViewcarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewcarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
