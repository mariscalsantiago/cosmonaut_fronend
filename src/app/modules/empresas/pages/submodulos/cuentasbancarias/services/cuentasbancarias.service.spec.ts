import { TestBed } from '@angular/core/testing';

import { CuentasbancariasService } from './cuentasbancarias.service';

describe('CuentasbancariasService', () => {
  let service: CuentasbancariasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentasbancariasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
