import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public modal:boolean = false;
  public strTitulo:string = "";
  public iconType:string = "";
  public strsubtitulo:string = "";


  public myForm!:FormGroup;





  public editarcampos:boolean = false;

  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.createForm({});
  }

  public createForm(obj:any){

    return this.formBuilder.group({});
  }

  public recibir(obj:any){

  
    this.modal = false;
    console.log(obj);

  }

  public enviandoFormulario(){

    this.modal = true;

  }

}
