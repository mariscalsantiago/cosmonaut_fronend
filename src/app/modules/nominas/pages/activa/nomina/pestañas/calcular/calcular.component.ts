import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {
  @Output() salida = new EventEmitter();
  public cargando:boolean = false;
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
  }


  public cargandoIcon:boolean = false;


  public arreglo:any = [];

  constructor(private nominasPrd:NominasService,private empleadoPrd:EmpleadosService,private navigate:Router,
    private modalPrd:ModalService) { }

  ngOnInit(): void {


    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = [datos.datos[0]];
      
      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Nombre"),
        new tabla("numEmpleado","Número de empleado",false,false,true),
        new tabla("diaslaborados","Días laborados",false,false,true),
        new tabla("percepciones","Percepciones",false,false,true),
        new tabla("deducciones","Deducciones",false,false,true),
        new tabla("total","Total",false,false,true)
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]="Santiago Dario Ocampo";
          item["diaslaborados"]=15.2;
          item["percepciones"]="$16,499.96";
          item["deducciones"]="$3,380.60";
          item["total"]="$13,271.36";
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

  public regresar(){
      this.navigate.navigate(["/nominas/activas"]);
  }

  public continuar(){
    this.salida.emit({type:"calcular"});
  }

}
