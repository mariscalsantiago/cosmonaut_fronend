import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleempresasComponent } from './detalleempresas.component';

describe('DetalleempresasComponent', () => {
  let component: DetalleempresasComponent;
  let fixture: ComponentFixture<DetalleempresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleempresasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleempresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
