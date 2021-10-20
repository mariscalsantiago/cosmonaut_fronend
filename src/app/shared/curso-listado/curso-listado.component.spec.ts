import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoListadoComponent } from './curso-listado.component';

describe('CursoListadoComponent', () => {
  let component: CursoListadoComponent;
  let fixture: ComponentFixture<CursoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoListadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
