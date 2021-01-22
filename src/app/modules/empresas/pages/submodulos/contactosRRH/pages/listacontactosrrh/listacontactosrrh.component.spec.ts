import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacontactosrrhComponent } from './listacontactosrrh.component';

describe('ListacontactosrrhComponent', () => {
  let component: ListacontactosrrhComponent;
  let fixture: ComponentFixture<ListacontactosrrhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListacontactosrrhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListacontactosrrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
