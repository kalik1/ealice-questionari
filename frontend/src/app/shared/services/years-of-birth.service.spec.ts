import { TestBed } from '@angular/core/testing';

import { YearsOfBirthService } from './years-of-birth.service';

describe('YearsOfBirthService', () => {
  let service: YearsOfBirthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearsOfBirthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
