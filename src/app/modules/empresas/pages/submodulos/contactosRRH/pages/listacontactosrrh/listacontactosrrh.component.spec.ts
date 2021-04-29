import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ShareModule } from 'src/app/shared/share.module';

import { ListacontactosrrhComponent } from './listacontactosrrh.component';

describe('ListacontactosrrhComponent', () => {
  let component: ListacontactosrrhComponent;
  let fixture: ComponentFixture<ListacontactosrrhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule,FormsModule,ReactiveFormsModule,ShareModule],
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
