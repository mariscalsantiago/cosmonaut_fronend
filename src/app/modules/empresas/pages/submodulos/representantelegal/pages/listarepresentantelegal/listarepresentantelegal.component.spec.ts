import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListarepresentantelegalComponent } from './listarepresentantelegal.component';

describe('ListarepresentantelegalComponent', () => {
  let component: ListarepresentantelegalComponent;
  let fixture: ComponentFixture<ListarepresentantelegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule],
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
