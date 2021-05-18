import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';

@Component({
  selector: 'app-timbrar',
  templateUrl: './timbrar.component.html',
  styleUrls: ['./timbrar.component.scss']
})
export class TimbrarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public arreglo: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public datosExtras: any = { datos: undefined };

  public llave: string = "";
  public llave2: string = "";


  @Input() nominaSeleccionada: any;

  constructor(private empleadoPrd: EmpleadosService, private ventana: VentanaemergenteService,
    private modalPrd: ModalService, private nominaOrdinariaPrd:NominaordinariaService,
    private nominaAguinaldoPrd:NominaaguinaldoService,private nominaLiquidacionPrd:NominafiniquitoliquidacionService, private cp: CurrencyPipe) { }

  ngOnInit(): void {


    this.cargando = true;
    let objEnviar = {
      nominaXperiodoId: 0
    }



    if (this.nominaSeleccionada.nominaOrdinaria) {
      objEnviar.nominaXperiodoId = this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId;
      this.initOrdinaria(objEnviar);
      this.llave = "reciboATimbrar";
      this.llave2 = "nominaOrdinaria";
      
    } else if (this.nominaSeleccionada.nominaExtraordinaria) {
      objEnviar.nominaXperiodoId = this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId;
      this.initExtraordinaria(objEnviar);
      this.llave = "reciboATimbrarAguinaldo";
      this.llave2 = "nominaExtraordinaria";

      
    }else if(this.nominaSeleccionada.nominaLiquidacion){
      objEnviar.nominaXperiodoId = this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId;
      this.initLiquidacion(objEnviar);
      this.llave = "reciboATimbrarLiquidacion";
      this.llave2 = "nominaLiquidacion";
      
    }
  }

  public initOrdinaria(objEnviar: any) {

    this.nominaOrdinariaPrd.getUsuariosTimbrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);

    });

  }

  public initExtraordinaria(objEnviar: any) {


    this.nominaAguinaldoPrd.getUsuariosTimbrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);

    });


  }

  public initLiquidacion(objEnviar:any){
    this.nominaLiquidacionPrd.getUsuariosTimbrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);

    });
  }


  public recibirTabla(obj: any) {


    switch (obj.type) {
      case "desglosar":
        let item = obj.datos;
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave2]?.nominaXperiodoId,
          fechaContrato: item.fechaContrato,
          personaId: item.personaId,
          clienteId: item.centrocClienteId
        }


        if (this.nominaSeleccionada.nominaOrdinaria) {

          this.nominaOrdinariaPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminar = datos.datos[0].xmlPreliminar;
            
            this.datosExtras.datos = xmlPreliminar;
            item.cargandoDetalle = false;
          });
         
        } else if (this.nominaSeleccionada.nominaExtraordinaria) {
        
          this.nominaAguinaldoPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminarAguinaldo = datos.datos[0].xmlPreliminarAguinaldo;
            
            this.datosExtras.datos = xmlPreliminarAguinaldo;
            item.cargandoDetalle = false;
          });


        }else if (this.nominaSeleccionada.nominaLiquidacion) {
        
          this.nominaLiquidacionPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminarLiquidacion = datos.datos[0].xmlPreliminarLiquidacion;
            
            this.datosExtras.datos = xmlPreliminarLiquidacion;
            item.cargandoDetalle = false;
          });


        }


       

        break;
    }
  }

  public definirFecha() {
    this.ventana.showVentana(this.ventana.timbrado, { ventanaalerta: true });
  }


  public timbrar() {
    this.ventana.showVentana(this.ventana.timbrar, { ventanaalerta: true }).then(datos => {

      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      setTimeout(() => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.ventana.showVentana(this.ventana.ntimbrado).then(() => {
          this.salida.emit({ type: "timbrar" });
        });;
      }, 2000);

    });;
  }

  public regresar() {

  }


  public rellenarTablas(datos: any) {

    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Empleados"),
      new tabla("tipo", "Método de pago", false, false, true),
      new tabla("total", "Total neto", false, false, true),
      new tabla("fecha", "Fecha de pago de timbrado", false, false, true),
      new tabla("status", "Estatus ", false, false, true)

    ];
    for (let item of this.arreglo) {
      item["nombrecompleto"] = item[this.llave]?.nombreEmpleado + " " + item[this.llave]?.apellidoPatEmpleado + " ";
      item["nombrecompleto"] += +(item[this.llave]?.apellidoMatEmpleado == undefined) ? "" : item[this.llave]?.apellidoMatEmpleado;
      item["tipo"] = item[this.llave]?.tipoPago;
      item["total"] = this.cp.transform(item[this.llave]?.totalNeto);
      item["fecha"] = new DatePipe("es-MX").transform(item[this.llave]?.fechaPagoTimbrado, "dd/MM/yyyy");
      item["status"] = item[this.llave]?.status;

    }
    let filas: Array<any> = this.arreglo;

    this.arreglotabla = {
      columnas: columnas,
      filas: filas
    }


    this.cargando = false;

  }

}
