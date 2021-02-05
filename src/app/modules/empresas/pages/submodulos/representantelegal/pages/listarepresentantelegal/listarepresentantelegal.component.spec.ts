import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarepresentantelegalComponent } from './listarepresentantelegal.component';

describe('ListarepresentantelegalComponent', () => {
  let component: ListarepresentantelegalComponent;
  let fixture: ComponentFixture<ListarepresentantelegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarepresentantelegalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarepresentantelegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
