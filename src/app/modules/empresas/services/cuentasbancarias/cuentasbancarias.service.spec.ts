import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CuentasbancariasService } from './cuentasbancarias.service';

describe('CuentasbancariasService', () => {
  let service: CuentasbancariasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(CuentasbancariasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
