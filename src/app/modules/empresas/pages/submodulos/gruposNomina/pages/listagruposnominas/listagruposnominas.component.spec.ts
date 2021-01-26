import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagruposnominasComponent } from './listagruposnominas.component';

describe('ListagruposnominasComponent', () => {
  let component: ListagruposnominasComponent;
  let fixture: ComponentFixture<ListagruposnominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListagruposnominasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagruposnominasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
