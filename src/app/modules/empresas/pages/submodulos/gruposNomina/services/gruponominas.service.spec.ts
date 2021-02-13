import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GruponominasService } from './gruponominas.service';

describe('GruponominasService', () => {
  let service: GruponominasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(GruponominasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
