import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-timbrar',
  templateUrl: './timbrar.component.html',
  styleUrls: ['./timbrar.component.scss']
})
export class TimbrarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  public cargando:boolean = false;
  public cargandoIcon:boolean = false;
  public arreglo:any = [];
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  public datosExtras:any = {datos:undefined};


  @Input() nominaSeleccionada:any;

  constructor(private nominasPrd:NominasService,private empleadoPrd:EmpleadosService,private ventana:VentanaemergenteService,
    private modalPrd:ModalService,private calculoPrd:CalculosService,private cp:CurrencyPipe) { }

  ngOnInit(): void {


    this.cargando = true;
   let objEnviar =  {
      nominaXperiodoId: 229
  }
    this.calculoPrd.getTotalEmpleadoConPagoTimbrado(objEnviar).subscribe(datos =>{

      this.arreglo = datos.datos;

      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Empleados"),
        new tabla("tipo","Método de pago",false,false,true),
        new tabla("total","Total neto",false,false,true),
        new tabla("fecha","Fecha de pago de timbrado",false,false,true),
        new tabla("status","Estatus ",false,false,true)
  
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]=item.reciboATimbrar.nombreEmpleado+" "+item.reciboATimbrar.apellidoPatEmpleado+" ";
          item["nombrecompleto"] += +(item.reciboATimbrar.apellidoMatEmpleado == undefined)?"":item.reciboATimbrar.apellidoMatEmpleado;
          item["tipo"]=item.reciboATimbrar.tipoPago;
          item["total"]=this.cp.transform(item.reciboATimbrar.totalNeto);
          item["fecha"]=new DatePipe("es-MX").transform(item.reciboATimbrar.fechaPagoTimbrado,"dd/MM/yyyy");
          item["status"]=item.reciboATimbrar.status;

      }
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }


      this.cargando = false;
    });

    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = [datos.datos[0]];


      

    });

    



  }


  public recibirTabla(obj:any){

    
       switch(obj.type){
          case "desglosar":
            let item = obj.datos;
            let objEnviar = {
              nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId,
              fechaContrato: item.fechaContrato,
              personaId: item.personaId,
              clienteId: item.centrocClienteId
            }

            this.calculoPrd.getTotalEmpleadoConPagoTimbradoDetalle(objEnviar).subscribe(datos=>{
              let xmlPreliminar = datos.datos[0].xmlPreliminar;
              console.log(xmlPreliminar);
              this.datosExtras.datos = xmlPreliminar;
              item.cargandoDetalle = false;
            });
            
            break;
       }
  }

  public definirFecha(){
    this.ventana.showVentana(this.ventana.timbrado,{ventanaalerta:true});
  }


  public timbrar(){
      this.ventana.showVentana(this.ventana.timbrar,{ventanaalerta:true}).then(datos =>{

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        setTimeout(() => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.ventana.showVentana(this.ventana.ntimbrado).then(()=>{
            this.salida.emit({type:"timbrar"});
          });;
        }, 2000);

      });;
  }

  public regresar(){
      
  }

}
