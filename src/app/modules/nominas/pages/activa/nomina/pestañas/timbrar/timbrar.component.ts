import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';

@Component({
  selector: 'app-timbrar',
  templateUrl: './timbrar.component.html',
  styleUrls: ['./timbrar.component.scss']
})
export class TimbrarComponent implements OnInit {


  public cargando:boolean = false;

  public arreglo:any = [];
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  constructor(private nominasPrd:NominasService,private empleadoPrd:EmpleadosService) { }

  ngOnInit(): void {

    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = datos.datos;


      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Empleados"),
        new tabla("tipo","Tipo de pago",false,false,true),
        new tabla("total","Total neto",false,false,true),
        new tabla("fecha","Fecha de pago de timbrado",false,false,true),
        new tabla("status","Estatus",false,false,true)
  
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]=item.personaId.nombre+" "+item.personaId.apellidoPaterno;
          item["rfc"]=item.personaId.rfc;
          item["diaslaborados"]="BBVA Bancomer";
          item["percepciones"]="$26,200.00";
          item["tipo"]="Transferencia";
          item["total"]="$25,700.00";
          item["status"]="Sin timbrar";
          item["fecha"]=new DatePipe("es-MX").transform(new Date(),"dd-MMM-yy")?.replace(".","");
      }
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }


    });

    



  }


  public recibirTabla(obj:any){

  }

}
