import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public modal: boolean = false;

  public activado = [
    { tab: false, form: false, disabled: false }, 
    { tab: false, form: false, disabled: false }, 
    { tab: true, form: true, disabled: false },
    { tab: false, form: false, disabled: false }
  ];
  
  public cambiaValor: boolean = false;
  public ocultarempleada:boolean = false;
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
    centrocClienteId:190
  };

  constructor( ) {

    }

  ngOnInit(): void {

  }



public recibir(elemento: any) {
  debugger;
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
    case "datosbancarios":

      this.activado[3].tab = true;
      this.activado[3].form = true;
      this.activado[3].disabled = false;
      this.activado[2].form = false;
      break;
    case "datosimss":

      this.activado[4].tab = true;
      this.activado[4].form = true;
      this.activado[4].disabled = false;
      this.activado[3].form = false;
      break;
  }

}

  public recibirAlerta(obj: any) {

    debugger;
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
            this.recibir({ type: "datosbancarios", valor: true });
            break;
          case 3:
            this.recibir({ type: "datosimss", valor: true });
            break;
            case 4:
              alert("Termina la petición de empresas")
            break;
        }

      }
    }

  }

  public recibiendoUserInsertado(evento:any){

    console.log("recibiendo el id empresa insertado",evento);

    this.datosempresa = evento;

  }



}
