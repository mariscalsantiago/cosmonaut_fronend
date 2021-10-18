import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioListadoComponent } from './anuncio-listado.component';

describe('AnuncioListadoComponent', () => {
  let component: AnuncioListadoComponent;
  let fixture: ComponentFixture<AnuncioListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnuncioListadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnuncioListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
