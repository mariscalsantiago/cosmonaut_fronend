import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {

  public cargando:boolean = false;
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
  }

  constructor() { }

  ngOnInit(): void {

    let columnas:Array<tabla> = [
      new tabla("nombre","Empleados"),
      new tabla("id","Número de empleado",true,false,true),
      new tabla("x","Días laborados"),
      new tabla("x","Percepciones"),
      new tabla("x","Deducciones"),
      new tabla("total","Total")
    ];

    let filas:Array<any> = [{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"}];

    this.arreglotabla = {
      columnas:columnas,
      filas:filas
    }

   

  }


  public recibirTabla(obj:any){
    switch(obj.type){
        case "desglosar":

          let columnas: Array<tabla> = [
            new tabla("nombre", "Salarío diarío"),
            new tabla("id", "Dias del periodo"),
            new tabla("total", "Sueldo"),
            new tabla("descuentaIncapacidadesdescripcion", "ISR")
          ];
  
  
          let item = obj.datos;
  
  
         
          this.arreglotablaDesglose.columnas = columnas;
          this.arreglotablaDesglose.filas = {nombre:"santiago",id:12,total:32,descuentaIncapacidadesdescripcion:32};
          item.cargandoDetalle = false;
          break;
    }
  }

}
