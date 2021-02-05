import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallecontactosrrhComponent } from './detallecontactosrrh.component';

describe('DetallecontactosrrhComponent', () => {
  let component: DetallecontactosrrhComponent;
  let fixture: ComponentFixture<DetallecontactosrrhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallecontactosrrhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallecontactosrrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
