import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada:any;

  public cargando:boolean = false;
  public cargandoIcon:boolean = false;
  public objEnviar: any = [];
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  public arreglo:any = [];

  constructor(private modalPrd:ModalService,private nominasPrd:NominasService,private empleadoPrd:EmpleadosService,
    private ventana:VentanaemergenteService,private calculoPrd:CalculosService,private cp:CurrencyPipe) { }



  ngOnInit(): void {

  debugger;
  if(this.nominaSeleccionada.nominaOrdinaria){
    this.nominaOrdinaria= true;
  
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId
    }
  
    this.cargando = true;
    this.calculoPrd.getTotalEmpleadoConPagoNeto(this.objEnviar).subscribe(datos =>{
      this.tablaNminaOrdinaria(datos);
    });
 
  }else if(this.nominaSeleccionada.nominaExtraordinaria){
    debugger;
    this.nominaExtraordinaria= true;
  
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId
    }
  
    
    this.cargando = true;
    this.calculoPrd.listaEmpleadoPagoExtraordinariaAguinaldo(this.objEnviar).subscribe(datos =>{
      this.tablaNminaExtraordinaria(datos);
    });

    
  }



 
  }


  public tablaNminaExtraordinaria(datos:any){
    this.arreglo = datos.datos;
  
 
    let columnas:Array<tabla> = [
      new tabla("nombrecompleto","Nombre"),
      new tabla("rfc","RFC",false,false,true),
      new tabla("banco","Banco",false,false,true),
      new tabla("total","Total",false,false,true),
      new tabla("tipopago","Tipo de pago",false,false,true),
      new tabla("status","Estatus ",false,false,true)
    ];
  
  
    for(let item of this.arreglo){

      item["nombrecompleto"]=item.empleadoApagoAguinaldo.nombreEmpleado+" "+item.empleadoApagoAguinaldo.apellidoPatEmpleado+" ";
      item["nombrecompleto"] += (item.empleadoApagoAguinaldo.apellidoMatEmpleado == undefined)?"":item.empleadoApagoAguinaldo.apellidoMatEmpleado;
      item["rfc"]="falta";
      item["banco"]=item.empleadoApagoAguinaldo.banco;
      item["tipopago"]=item.empleadoApagoAguinaldo.tipoPago;
      item["total"]=this.cp.transform(item.empleadoApagoAguinaldo.totalNetoEndinero);
      item["status"] = item.empleadoApagoAguinaldo.status;
  }
  
  let filas:Array<any> = this.arreglo;
  
  this.arreglotabla = {
    columnas:columnas,
    filas:filas
  }
  
  this.cargando = false;
  
  }

  public tablaNminaOrdinaria(datos:any){
  this.arreglo = datos.datos;

  console.log("dispesion empleado",this.arreglo);

  let columnas:Array<tabla> = [
    new tabla("nombrecompleto","Nombre"),
    new tabla("rfc","RFC",false,false,true),
    new tabla("banco","Banco",false,false,true),
    new tabla("total","Total",false,false,true),
    new tabla("tipopago","Tipo de pago",false,false,true),
    new tabla("status","Estatus ",false,false,true)
  ];


  for(let item of this.arreglo){
    console.log("Este es el nombre",item.empleadoApago.nombreEmpleado+" "+item.empleadoApago.apellidoPatEmpleado+" ");
    
    item["nombrecompleto"]=item.empleadoApago.nombreEmpleado+" "+item.empleadoApago.apellidoPatEmpleado+" ";
    item["nombrecompleto"] += (item.empleadoApago.apellidoMatEmpleado == undefined)?"":item.empleadoApago.apellidoMatEmpleado;
    item["rfc"]="falta";
    item["banco"]=item.empleadoApago.banco;
    item["tipopago"]=item.empleadoApago.tipoPago;
    item["total"]=this.cp.transform(item.empleadoApago.totalNetoEndinero);
    item["status"] = item.empleadoApago.status;
}

let filas:Array<any> = this.arreglo;

this.arreglotabla = {
  columnas:columnas,
  filas:filas
}

this.cargando = false;

}

  public continuar(){

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas continuar?").then(valor =>{
      if(valor){
        this.salida.emit({type:"dispersar"});
      }
    });
  }

 

  public recibirTabla(obj:any){


  }

  public regresar(){
     
  }

  public dispersar(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas dispersar la nómina?").then(valor =>{
      if(valor){


        this.ventana.showVentana(this.ventana.ndispersion).then(valor =>{
          this.salida.emit({type:"dispersar"});
        });;

        

       
      }
    });
  }

}
