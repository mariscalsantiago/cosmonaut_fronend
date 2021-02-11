import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public activado = [{ tab: true, form: true, disabled: false }, { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false },
  { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false }];


  public alerta = {

    modal:false,
    strTitulo:"",
    iconType:"",
    strsubtitulo:""
  };

  public enviarPeticion = {
    enviarPeticion : false
  };

  public cambiaValor:boolean = false;

  constructor() { }

  ngOnInit(): void {
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
      case "preferencias":

        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].disabled = false;
        this.activado[2].form = false;
        break;
      case "empleo":

        this.activado[4].tab = true;
        this.activado[4].form = true;
        this.activado[4].disabled = false;
        this.activado[3].form = false;
        break;
      case "detalle":

        this.activado[5].tab = true;
        this.activado[5].form = true;
        this.activado[5].disabled = false;
        this.activado[4].form = false;
        break;
    }

  }


  public recibirAlerta(obj:any){

    this.cambiaValor = !this.cambiaValor;
    
    this.alerta.modal = false;
    this.enviarPeticion.enviarPeticion = false;
    

    if(this.alerta.iconType === "warning" ){

      if(obj){
        this.enviarPeticion.enviarPeticion = true;
      }


    }else{
      if(this.alerta.iconType == "success"){
          this.recibir({type:"informacion",valor:true});
      }
    }

  }




}
