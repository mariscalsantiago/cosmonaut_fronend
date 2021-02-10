import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UsuariocontactorrhService } from './usuariocontactorrh.service';

describe('UsuariocontactorrhService', () => {
  let service: UsuariocontactorrhService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(UsuariocontactorrhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
