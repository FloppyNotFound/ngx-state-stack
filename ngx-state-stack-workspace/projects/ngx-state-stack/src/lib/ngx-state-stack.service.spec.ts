import { TestBed } from '@angular/core/testing';

import { NgxStateStackService } from './ngx-state-stack.service';

describe('NgxStateStackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxStateStackService = TestBed.get(NgxStateStackService);
    expect(service).toBeTruthy();
  });
});
