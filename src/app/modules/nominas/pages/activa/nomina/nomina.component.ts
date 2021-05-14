import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominasService } from '../../../services/nominas.service';

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

    public nominaSeleccionada:any;
    public arreglo:any = [];

    public llave:string = "";

  constructor(private nominaPrd:NominasService,private calculoPrd:NominaordinariaService) { }

  ngOnInit(): void {

   

    let temp = history.state.datos == undefined ? {} : history.state.datos;


    console.log(temp);

    if(temp.nominaOrdinaria){
      console.log("entra");
      this.llave = "nominaOrdinaria";
     }else if(temp.nominaExtraordinaria){
       console.log("extra  ");
       this.llave = "nominaExtraordinaria";
     }

     this.nominaSeleccionada = temp;
   


   
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
