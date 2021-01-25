import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-detallecuentasbancarias',
  templateUrl: './detallecuentasbancarias.component.html',
  styleUrls: ['./detallecuentasbancarias.component.scss']
})
export class DetallecuentasbancariasComponent implements OnInit {

  public iconType:string = "";
  public myForm!:FormGroup;
  public modal:boolean = false;
  public strTitulo:string = "";
  public strsubtitulo:string = "";
  public id_empresa:number = 0;
  constructor(private formBuild:FormBuilder,private routerPrd:Router,
     private routerActive:ActivatedRoute,private cuentasPrd:CuentasbancariasService) { }

  ngOnInit(): void {


    let obj = {};

    this.myForm = this.createForm(obj);


    this.routerActive.params.subscribe(datos =>{
      
      this.id_empresa = datos["id"];
    });

  }

  public createForm(obj:any){
  


    return this.formBuild.group({


    });

  }



  public enviarPeticion(){

  }


  public cancelar(){
    this.routerPrd.navigate(['/empresa/detalle',this.id_empresa,'cuentasbancarias']);
  }


  get f(){
    return this.myForm.controls;
  }


  public recibir($event:any){


  }


}
