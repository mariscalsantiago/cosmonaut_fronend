import { TestBed } from '@angular/core/testing';

import { CatalogosService } from './catalogos.service';

describe('CatalogosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogosService = TestBed.get(CatalogosService);
    expect(service).toBeTruthy();
  });
});