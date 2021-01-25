import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';

@Component({
  selector: 'app-detallecontactosrrh',
  templateUrl: './detallecontactosrrh.component.html',
  styleUrls: ['./detallecontactosrrh.component.scss']
})
export class DetallecontactosrrhComponent implements OnInit {



  public iconType:string = "";
  public myForm!:FormGroup;
  public modal:boolean = false;
  public strTitulo:string = "";
  public strsubtitulo:string = "";
  constructor(private formBuild:FormBuilder,private usuariosPrd:UsuariocontactorrhService) { }

  ngOnInit(): void {


    let obj = {};

    this.myForm = this.createForm(obj);

  }

  public createForm(obj:any){
  


    return this.formBuild.group({


    });

  }



  public enviarPeticion(){

  }


  public cancelar(){

  }


  get f(){
    return this.myForm.controls;
  }


  public recibir($event:any){


  }


 

}
