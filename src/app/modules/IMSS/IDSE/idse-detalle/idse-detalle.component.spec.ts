import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdseDetalleComponent } from './idse-detalle.component';

describe('IdseDetalleComponent', () => {
  let component: IdseDetalleComponent;
  let fixture: ComponentFixture<IdseDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdseDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdseDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
