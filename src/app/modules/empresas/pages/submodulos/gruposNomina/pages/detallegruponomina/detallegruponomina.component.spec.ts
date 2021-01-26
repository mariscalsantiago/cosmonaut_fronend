import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallegruponominaComponent } from './detallegruponomina.component';

describe('DetallegruponominaComponent', () => {
  let component: DetallegruponominaComponent;
  let fixture: ComponentFixture<DetallegruponominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallegruponominaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallegruponominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
