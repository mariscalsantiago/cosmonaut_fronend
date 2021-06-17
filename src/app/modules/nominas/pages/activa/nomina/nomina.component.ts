import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';



@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {
  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false }];

  public nominaSeleccionada: any;
  public arreglo: any = [];

  public llave: string = "";


  public esRegistrar: boolean = false;
  public esCalcular: boolean = false;
  public esConsultar: boolean = false;
  public esConcluir: boolean = false;
  public esDispersar: boolean = false;
  public esEliminar: boolean = false;
  public esTimbrar: boolean = false;
  public esDescargar: boolean = false;

  constructor(private configuracionesPrd: ConfiguracionesService) { }

  ngOnInit(): void {

    this.establecerPermisos();




    let temp = history.state.datos == undefined ? {} : history.state.datos;


    console.log("ESTE ES LA TEMPORAL",temp);


    if (temp.nominaOrdinaria) {
      this.llave = "nominaOrdinaria";
    } else if (temp.nominaExtraordinaria) {
      this.llave = "nominaExtraordinaria";
    } else if (temp.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
    } else if (temp.nominaPtu) {
      this.llave = "nominaPtu";
    }

    this.nominaSeleccionada = temp;

    if(this.esCalcular){
      this.activado[0].tab = true;
      this.activado[0].form = true;
      this.activado[0].seleccionado = true;
    }else if(this.esDispersar){
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[1].tab = true;
      this.activado[1].form = true;
      this.activado[1].seleccionado = true;
    }else if(this.esTimbrar){
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[2].tab = true;
      this.activado[2].form = true;
      this.activado[2].seleccionado = true;
    }else if(this.esConcluir){
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[3].tab = true;
      this.activado[3].form = true;
      this.activado[3].seleccionado = true;
    }




  }

  public establecerPermisos() {
    this.esRegistrar = !this.configuracionesPrd.getPermisos("Registrar");
    this.esCalcular = this.configuracionesPrd.getPermisos("Calcular");
    this.esConsultar = !this.configuracionesPrd.getPermisos("Consultar");
    this.esConcluir = !this.configuracionesPrd.getPermisos("Concluir");
    this.esDispersar =!this.configuracionesPrd.getPermisos("Dispersar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
    this.esTimbrar = !this.configuracionesPrd.getPermisos("Timbrar");
    this.esDescargar = this.configuracionesPrd.getPermisos("Descargar");

   
  }

  public backTab(numero: number) {
    if (!this.activado[numero].tab) return;
    for (let item of this.activado) {
      item.seleccionado = false;
      item.form = false;
    }


    this.activado[numero].seleccionado = true;
    this.activado[numero].form = true;
  }


  public recibirComponente(obj: any) {


  

    if (!this.esDispersar && obj.type == "calcular") {
       if(this.esTimbrar){
          obj.type = "dispersar";
        }else if(this.esConcluir){
          obj.type = "timbrar";  
        }else{
          return;
        }
    }else  if (!this.esTimbrar && obj.type == "dispersar") {
      if(this.esConcluir){
       obj.type = "timbrar";   
     }else{
       return;
     }
   }else  if (!this.esConcluir && obj.type == "timbrar") {
     return;
 }



   for (let item of this.activado) {
    item.seleccionado = false;
    item.form = false;
  }

   

   






    switch (obj.type) {
      case "calcular":
        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        break;
      case "dispersar":
        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].seleccionado = true;
        break;
      case "timbrar":
        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].seleccionado = true;
        break;
    }
  }

}
