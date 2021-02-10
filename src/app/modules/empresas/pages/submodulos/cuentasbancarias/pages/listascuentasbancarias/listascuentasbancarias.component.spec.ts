import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListascuentasbancariasComponent } from './listascuentasbancarias.component';

describe('ListascuentasbancariasComponent', () => {
  let component: ListascuentasbancariasComponent;
  let fixture: ComponentFixture<ListascuentasbancariasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule.withRoutes([]),HttpClientTestingModule],
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
