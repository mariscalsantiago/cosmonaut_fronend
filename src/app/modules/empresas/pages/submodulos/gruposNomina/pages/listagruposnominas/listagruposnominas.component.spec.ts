import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ShareModule } from 'src/app/shared/share.module';

import { ListagruposnominasComponent } from './listagruposnominas.component';

describe('ListagruposnominasComponent', () => {
  let component: ListagruposnominasComponent;
  let fixture: ComponentFixture<ListagruposnominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule,FormsModule,ReactiveFormsModule,ShareModule],
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
