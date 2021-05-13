import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada:any;
  public cargando:boolean = false;
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public objEnviar: any = [];
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

  constructor(private nominasPrd:NominasService,private navigate:Router,
    private modalPrd:ModalService,private calculoPrd:CalculosService,private cp: CurrencyPipe) { }

  ngOnInit(): void {

debugger;

if(this.nominaSeleccionada.nominaOrdinaria){
  this.nominaOrdinaria= true;

  this.cargando = true;
  this.objEnviar = {
    nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId
}

}else if (this.nominaSeleccionada.nominaExtraordinaria){
  this.nominaOrdinaria= true;
  this.cargando = true;
  this.objEnviar = {
    nominaXperiodoId: this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId
}

  
}



  
    this.calculoPrd.getEmpleadosByNomina(this.objEnviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos
       
      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Nombre"),
        new tabla("numEmpleado","Número de empleado",false,false,true),
        new tabla("diaslaborados","Días laborados",false,false,true),
        new tabla("percepciones","Percepciones",false,false,true),
        new tabla("deducciones","Deducciones",false,false,true),
        new tabla("total","Total",false,false,true)
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]=item.calculoEmpleado.empleado;
          item["diaslaborados"]=item.calculoEmpleado.diasLaborados;
          item["percepciones"]=this.cp.transform(item.calculoEmpleado.percepciones);
          item["deducciones"]=this.cp.transform(item.calculoEmpleado.deducciones);
          item["total"]=this.cp.transform(item.calculoEmpleado.total);
      }
  
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }
    });
   


   



 

   

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
          let objEnviar = {
            nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId,
            fechaContrato: item.fechaContrato,
            personaId: item.personaId,
            clienteId: item.centrocClienteId
        }

         this.calculoPrd.getEmpleadosByNominaDetalle(objEnviar).subscribe(datosItem =>{
           
          item.cargandoDetalle = false;
        });
  
         
          this.arreglotablaDesglose.columnas = columnas;
          this.arreglotablaDesglose.filas = {nombre:"santiago",id:12,total:32,descuentaIncapacidadesdescripcion:32};
          item.cargandoDetalle = false;
          break;
    }
  }

  public regresarOrdinaria(){
      this.navigate.navigate(["/nominas/activas"]);
  }

  public regresarExtraordinaria(){
    this.navigate.navigate(["/nominas/nomina_extraordinaria"]);
}

  public continuar(){
    this.salida.emit({type:"calcular"});
  }

}
