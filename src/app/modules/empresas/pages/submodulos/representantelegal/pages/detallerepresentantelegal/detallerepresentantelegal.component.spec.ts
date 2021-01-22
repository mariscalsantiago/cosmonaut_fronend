import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallerepresentantelegalComponent } from './detallerepresentantelegal.component';

describe('DetallerepresentantelegalComponent', () => {
  let component: DetallerepresentantelegalComponent;
  let fixture: ComponentFixture<DetallerepresentantelegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallerepresentantelegalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallerepresentantelegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
