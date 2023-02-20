import { TestBed } from '@angular/core/testing';

import { LocalstrorageService } from './localstrorage.service';

describe('LocalstrorageService', () => {
  let service: LocalstrorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstrorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
