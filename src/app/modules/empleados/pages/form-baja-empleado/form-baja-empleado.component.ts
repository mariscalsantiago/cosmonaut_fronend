import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-baja-empleado',
  templateUrl: './form-baja-empleado.component.html',
  styleUrls: ['./form-baja-empleado.component.scss']
})
export class FormBajaEmpleadoComponent implements OnInit {
  public myForm!:FormGroup;

  constructor(private routerPrd:Router,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    let obj = {};
    this.myForm = this.createForm(obj);
  }

  public createForm(obj:any){
    return this.formBuilder.group({});
  }

  public cancelar(){
    this.routerPrd.navigate(['/empleados']);
  }

  public enviarFormulario(){
    
  }

}
