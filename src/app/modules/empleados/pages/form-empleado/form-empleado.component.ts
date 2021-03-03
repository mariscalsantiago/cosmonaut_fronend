import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public activado = [
  { tab: true, form: true, disabled: false }, 
  { tab: false, form: false, disabled: false }, 
  { tab: false, form: false, disabled: false },
  { tab: false, form: false, disabled: false }, 
  { tab: false, form: false, disabled: false } ];

  

  public ocultarempleada:boolean = false;

  public datosPersona:any={
    personaId:190
  };

  public alerta = {

    modal: false,
    strTitulo: "",
    iconType: "",
    strsubtitulo: ""
  };

  public enviarPeticion = {
    enviarPeticion: false
  };


  public metodopago:any = {descripcion:'sdfd'};

  public cambiaValor: boolean = false;

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.metodopago = {descripcion:"transferencia"}
      console.log("se ejecuta");
      console.log(this.metodopago);
    }, 4000);

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
        case "metodopago":

       
          this.metodopago = elemento.datos;

          break;
    }

  }


  public recibirAlerta(obj: any) {


    
    this.cambiaValor = !this.cambiaValor;
    

    this.alerta.modal = false;
    this.enviarPeticion.enviarPeticion = false;
    

    if (this.alerta.iconType === "warning") {
      
      if (obj) {
        
        this.enviarPeticion.enviarPeticion = true;
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

      

        switch (indexSeleccionado) {
          case 0:
            this.recibir({ type: "informacion", valor: true });
            this.ocultarempleada = true;
            break;
          case 1:
            this.recibir({ type: "domicilio", valor: true });
            break;
          case 2:
            this.recibir({ type: "preferencias", valor: true });
            break;
          case 3:
            this.recibir({ type: "empleo", valor: true });
            break;
            case 4:
              this.routerPrd.navigate(['empleados']);
            break;
        }

      }
    }

  }



  public recibiendoUserInsertado(evento:any){

    console.log("recibiendo el usuario insertadp",evento);

    this.datosPersona = evento;

  }


}
