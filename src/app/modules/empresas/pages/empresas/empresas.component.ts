import { Component, OnInit } from '@angular/core';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';

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
    { tab: false, form: false, disabled: false }
  ];
  
  public cambiaValor: boolean = false;
  public guardarDom: boolean = false;
  public cuentaBanco: boolean = false;
  public continuarDom: boolean = false;
  public continuarBancos: boolean = false
  public insertar: boolean = false;
  public centrocClienteEmpresa:number = 0;
  public objdetrep: any = [];
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
    insertar: this.insertar
  };

  public datosempresamod:any={
    datosempresaObj: this.objdetrep
  };
 
  constructor(private usuarioSistemaPrd:UsuarioSistemaService, private routerActivePrd: ActivatedRoute ) {
    debugger;
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.datosempresa.insertar= this.insertar;

    });

    }

  ngOnInit(): void {
    debugger;
    this.objdetrep = history.state.data == undefined ? {} : history.state.data ;
    this.datosempresamod.datosempresaObj= this.objdetrep;
    this.datosempresa.centrocClienteEmpresa = this.datosempresamod.datosempresaObj.centrocClienteId;
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
      if(this.continuarBancos && obj){
        
        this.recibir({ type: "datosbancarios", valor: true });
        this.continuarDom = false;
        this.continuarBancos= false;


      }
      else{
        if (obj) {
        
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
