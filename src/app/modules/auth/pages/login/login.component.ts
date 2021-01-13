import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm: FormGroup;

  public error:boolean = false;
  public cargando:boolean = false;
  public correcto:boolean = false;
  public ventanapass:boolean = false;

  constructor(public formBuilder: FormBuilder,private routerPrd:Router) { 
    let obj = {};
    this.myForm = this.createMyForm(obj);


    console.log(this.myForm);
  }

  ngOnInit(): void {
  }

  public createMyForm(obj:any){
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  public enviarformulario(){
      let form = this.myForm.value;

      console.log("Lo que se envia",form);

      this.cargando = true;


      setTimeout(() => {
        
        this.cargando = false;
        this.correcto = true;

        setTimeout(() => {
          this.routerPrd.navigate(['/inicio']);
          
        }, 2000);
      }, 3000);
  }


  

}
