import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ShareModule } from 'src/app/shared/share.module';

import { ListascuentasbancariasComponent } from './listascuentasbancarias.component';

describe('ListascuentasbancariasComponent', () => {
  let component: ListascuentasbancariasComponent;
  let fixture: ComponentFixture<ListascuentasbancariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule,FormsModule,ReactiveFormsModule,ShareModule],
      declarations: [ ListascuentasbancariasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListascuentasbancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
