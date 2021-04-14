import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { Console } from 'console';
import { EmpresasService } from '../../services/empresas.service';
import { element } from 'protractor';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public modal: boolean = false;



  public activado = [
    { tab: true, form: true, disabled: false }, 
    { tab: false, form: false, disabled: false }, 
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false }
  ];
  
  public cambiaValor: boolean = false;
  public guardarDom: boolean = false;
  public cuentaBanco: boolean = false;
  public continuarDom: boolean = false;
  public continuarBancos: boolean = false;
  public continuarSede: boolean = false;
  public continuarCuentas: boolean= false;
  public activarGuardaMod: boolean = true;
  public insertar: boolean = false;
  public activarList : boolean = false;
  public activarForm : boolean = true;
  public centrocClienteEmpresa:number = 0;
  public objdetrep: any = [];
  public arregloactivos: any = [];
  public activos: any = [];
  public arreglo: any=[];
  public objModificar: any = [];


  public enviarPeticion = {
    enviarPeticion: false
  };

  public alerta = {

    modal: false,
    strTitulo: "",
    iconType: "",
    strsubtitulo: ""
  };

  public datosempresa:any={
    centrocClienteId:this.usuarioSistemaPrd.getIdEmpresa(),
    centrocClienteEmpresa:this.centrocClienteEmpresa,
    insertar: this.insertar,
    activarForm: this.activarForm,
    activarList: this.activarList,
    activarGuardaMod : this.activarGuardaMod,
    idModificar : this.objModificar, 
    
    
  };

  public datosempresamod:any={
    datosempresaObj: this.objdetrep
  };


  constructor(private usuarioSistemaPrd:UsuarioSistemaService,  private routerActivePrd: ActivatedRoute, private empresasProd: EmpresasService) {
    
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.datosempresa.insertar= this.insertar;
      if(!this.insertar){
        this.datosempresa.activarForm = false;
        this.datosempresa.activarList = true;

      }

    });

    }

  ngOnInit(): void {
    
    
    this.objdetrep = history.state.data == undefined ? {} : history.state.data ;
    this.datosempresamod.datosempresaObj= this.objdetrep; 
    if(!this.insertar){
    this.empresasProd.getActivos(this.objdetrep.centrocClienteId).subscribe(datos => {this.arreglo = datos
      console.log("datos", datos);
      this.activos ={
        informacion: datos.empresa,
        domicilio: datos.domicilio,
        datosbancarios: datos.banco,
        datosimss: datos.imss
        
        
      }
      if(this.activos.informacion){
        this.activado[0].tab = true;
      }
      if(this.activos.domicilio){
        this.activado[1].tab = true;
      }
      if(this.activos.datosbancarios){
        this.activado[2].tab = true;
      }
      if(this.activos.datosimss){
        this.activado[3].tab = true;
      }

    });
    }
    this.datosempresa.centrocClienteEmpresa = this.datosempresamod.datosempresaObj.centrocClienteId;

  }


  public empresa(){
    if(!this.insertar){
    this.recibirTabs({ type: "informacion", valor: true });
    }
  }

  public domicilio(){
    if(!this.insertar){
    this.recibirTabs({ type: "domicilio", valor: true });
    }
  }
  public bancos(){
    if(!this.insertar){
    this.recibirTabs({ type: "datosbancarios", valor: true });
    }
  }

  public imss(){
    if(!this.insertar){
    this.recibirTabs({ type: "datosimss", valor: true });
    }
  }

  public recibirTabs(elemento: any) {
    
 
   switch (elemento.type) {
     case "informacion":
 
       this.activado[0].tab = true;
       this.activado[0].form = true;
       this.activado[0].disabled = false;
       this.activado[1].form = false;
       this.activado[2].form = false;
       this.activado[3].form = false;
       this.activado[4].form = false;
       this.activado[5].form = false;
       this.activado[1].tab = false;
       this.activado[2].tab = false;
       this.activado[3].tab = false;
       this.activado[4].tab = false;
       this.activado[5].tab = false;

       break;
     case "domicilio":
 
       this.activado[1].tab = true;
       this.activado[1].form = true;
       this.activado[1].disabled = false;
       this.activado[0].form = false;
       this.activado[2].form = false;
       this.activado[3].form = false;
       this.activado[4].form = false;
       this.activado[5].form = false;
       this.activado[0].tab = false;
       this.activado[2].tab = false;
       this.activado[3].tab = false;
       this.activado[4].tab = false;
       this.activado[5].tab = false;
       break;
     case "datosbancarios":
 
       this.activado[2].tab = true;
       this.activado[2].form = true;
       this.activado[2].disabled = false;
       this.activado[0].form = false;
       this.activado[1].form = false;
       this.activado[3].form = false;
       this.activado[4].form = false;
       this.activado[5].form = false;
       this.activado[0].tab = false;
       this.activado[1].tab = false;
       this.activado[3].tab = false;
       this.activado[4].tab = false;
       this.activado[5].tab = false;
       break;
       case "datosimss":
 
         this.activado[3].tab = true;
         this.activado[3].form = true;
         this.activado[3].disabled = false;
         this.activado[0].form = false;
         this.activado[1].form = false;
         this.activado[2].form = false;
         this.activado[4].form = false;
         this.activado[5].form = false;
         this.activado[0].tab = false;
         this.activado[1].tab = false;
         this.activado[2].tab = false;
         this.activado[4].tab = false;
         this.activado[5].tab = false;
         break;
   }
  }
 

public recibir(elemento: any) {
   

  switch (elemento.type) {
    case "informacion":

      this.activado[1].tab = true;
      this.activado[1].form = true;
      this.activado[1].disabled = false;
      this.activado[0].form = false;
      break;
    case "domicilio":

      this.activado[2].tab = true;
      this.activado[2].form = true;
      this.activado[2].disabled = false;
      this.activado[1].form = false;
      break;
    case "domicilioSede":

      this.guardarDom = true;
        break;
    case "domicilioCont":

      this.continuarDom = true;
        break;
    case "sedeCont":

      this.continuarSede = true;
    break;
    case "cuentasCont":

      this.continuarCuentas = true;
    break;
    case "bancosCont":

      this.continuarBancos = true;
    break;
    case "cuentasBancarias":

      this.cuentaBanco = true;
    break;
    case "datosbancarios":

      this.activado[3].tab = true;
      this.activado[3].form = true;
      this.activado[3].disabled = false;
      this.activado[2].form = false;
      break;
    case "sede":

        this.activado[1].tab = true;
        this.activado[4].form = true;
        this.activado[4].disabled = false;
        this.activado[1].form = false;
    break;
    case "sedeDom":

      this.activado[1].tab = true;
      this.activado[1].form = true;
      this.activado[1].disabled = false;
      this.activado[4].form = false;
  break;
  case "cuentas":

    this.activado[2].tab = true;
    this.activado[5].form = true;
    this.activado[5].disabled = false;
    this.activado[2].form = false;
  break;
  case "cuentaDatosBancarios":

    this.activado[2].tab = true;
    this.activado[2].form = true;
    this.activado[2].disabled = false;
    this.activado[5].form = false;
  break;
  }

}

  public recibirAlerta(obj: any) {
    
     
    this.cambiaValor = !this.cambiaValor;
     

    this.alerta.modal = false;
    this.enviarPeticion.enviarPeticion = false;
    

    if (this.alerta.iconType === "warning") {

      if(this.continuarDom && obj){
        
        this.recibir({ type: "domicilio", valor: true });
        this.continuarDom = false;

      }
      if(this.continuarSede && obj){
        
        this.recibir({ type: "sedeDom", valor: true });
        this.continuarSede = false;
        this.datosempresa.activarGuardaMod = false;

      }
      if(this.continuarCuentas && obj){
        
        this.recibir({ type: "cuentaDatosBancarios", valor: true });
        this.continuarCuentas = false;
        this.datosempresa.activarGuardaMod = false;
      }
      if(this.continuarBancos && obj){
        
        this.recibir({ type: "datosbancarios", valor: true });
        this.continuarDom = false;
        this.continuarBancos= false;
        


      }
      else{
        if (obj && this.datosempresa.activarGuardaMod) {
        
          this.enviarPeticion.enviarPeticion = true;
        }
      }
      


    } else {
      if (this.alerta.iconType == "success") {

        let indexSeleccionado = 0;
        for (let x = 0; x < this.activado.length; x++) {
          if (this.activado[x].form) {

            indexSeleccionado = x;
            break;
          }
        }

        if(indexSeleccionado==1 && this.guardarDom){
           indexSeleccionado=3;
        }

        if(indexSeleccionado==2 && this.cuentaBanco){
          indexSeleccionado=3;
       }

        switch (indexSeleccionado) {
          case 0:
            this.recibir({ type: "informacion", valor: true });

            break;
          case 1:
            this.recibir({ type: "domicilio", valor: true });
            break;
          case 2:
            this.recibir({ type: "datosbancarios", valor: true });
            break;
          case 3:
            this.guardarDom = false;
            this.cuentaBanco = false;
          break;

        }
      

      }
    }

  }

  public recibiendoUserInsertado(evento:any){

    this.datosempresa = evento;
    this.datosempresamod = evento;


  }



}
