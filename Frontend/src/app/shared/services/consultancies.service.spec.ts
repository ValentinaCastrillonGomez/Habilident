import { TestBed } from '@angular/core/testing';

import { ConsultanciesService } from './consultancies.service';

describe('ConsultanciesService', () => {
  let service: ConsultanciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultanciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
