import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule,HttpClientModule ,RouterTestingModule.withRoutes([])],
      providers: [HttpClient]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('Válidar botón', () => {
    component.myForm.value.username = "";
    component.myForm.value.password = "";
    expect(component.myForm.valid).toBe(false);
});

  it('Formulario inválido empty', () => {
      component.myForm.value.username = "";
      component.myForm.value.password = "";
      expect(component.myForm.valid).toBeFalse();
  });
  it('Validaciones', ()=> {
    expect(component.myForm.controls.username.errors?.required).toBe(true);
    expect(component.myForm.controls.username.hasError('required')).toBe(true);
    expect(component.myForm.controls.password.hasError('required')).toBe(true);
 });
  /*it('Formulario válido', () => {
    component.enviarformulario();
    component.myForm.value.username = "naye291189@gmail.com";
    component.myForm.value.password = "n@yE2989";
    expect(component.myForm.valid).toBe(true);
  });*/

});

