import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallepuestosComponent } from './detallepuestos.component';

describe('DetallerepresentantelegalComponent', () => {
  let component: DetallepuestosComponent;
  let fixture: ComponentFixture<DetallepuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallepuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallepuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
