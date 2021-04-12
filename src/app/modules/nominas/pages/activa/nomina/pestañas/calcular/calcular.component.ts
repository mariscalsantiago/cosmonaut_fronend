import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';

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


  public arreglo:any = [];

  constructor(private nominasPrd:NominasService,private empleadoPrd:EmpleadosService) { }

  ngOnInit(): void {


    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = datos.datos;
      
      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Nombre"),
        new tabla("numEmpleado","Número de empleado",true,false,true),
        new tabla("diaslaborados","Días laborados",false,false,true),
        new tabla("percepciones","Percepciones",false,false,true),
        new tabla("deducciones","Deducciones",false,false,true),
        new tabla("total","Total",false,false,true)
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]=item.personaId.nombre+" "+item.personaId.apellidoPaterno;
          item["diaslaborados"]=5;
          item["percepciones"]="$26,200.00";
          item["deducciones"]="$500.00";
          item["total"]="$25,700.00";
      }
  
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }
    });




 

   

  }


  public recibirTabla(obj:any){
    console.log(obj);
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
