import { TestBed, inject } from '@angular/core/testing';

import { BaseConverterService } from './base-converter.service';

describe('BaseConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseConverterService]
    });
  });

  it('should be created', inject([BaseConverterService], (service: BaseConverterService) => {
    expect(service).toBeTruthy();
  }));
});
