import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada: any;
  @Input() esEliminar:boolean = false;
  @Input() esDescargar:boolean = false;
  public cargando: boolean = false;
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public nominaLiquidacion:boolean = false;
  public nominaPtu:boolean = false;
  public objEnviar: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public llave: string = "";
  public llave2:string = "";

  public datosDetalleEmpleadoNomina:any = [];

  public cargandoIcon: boolean = false;


  public arreglo: any = [];

  constructor(private navigate: Router,
    private modalPrd: ModalService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService,private nominaFiniquito:NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private nominaPtuPrd:NominaptuService,private reportesPrd:ReportesService) { }

  ngOnInit(): void {



    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.llave = "nominaOrdinaria";
      this.llave2 = "calculoEmpleado";
      this.nominaOrdinaria = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId
      }

      this.nominaOrdinariaPrd.getUsuariosCalculados(this.objEnviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleado");
      });

    } else if (this.nominaSeleccionada.nominaExtraordinaria) {

      this.llave = "nominaExtraordinaria";
      this.llave2 = "calculoEmpleadoAguinaldo";

      this.nominaExtraordinaria = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId
      }

      this.nominaAguinaldoPrd.getUsuariosCalculados(this.objEnviar).subscribe(datos => {

        
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoAguinaldo");
      });

    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
      this.llave2 = "calculoEmpleadoLiquidacion";
      this.nominaLiquidacion = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId
      }

      this.nominaFiniquito.getUsuariosCalculados(this.objEnviar).subscribe(datos => {

        
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoLiquidacion");
      });
    }else if(this.nominaSeleccionada.nominaPtu){
      this.llave = "nominaPtu";
      this.llave2 = "calculoEmpleadoPtu";
      this.nominaPtu = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaPtu?.nominaXperiodoId
      }

      this.nominaPtuPrd.getUsuariosCalculados(this.objEnviar).subscribe(datos => {

        
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoPtu");
      });
    }



  }


  public rellenandoTablas(llave: string) {
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("numeroEmpleado", "Número de empleado", false, false, true),
      new tabla("diaslaborados", "Días laborados", false, false, true),
      new tabla("percepciones", "Percepciones", false, false, true),
      new tabla("deducciones", "Deducciones", false, false, true),
      new tabla("total", "Total", false, false, true)
    ];


    for (let item of this.arreglo) {
      

      item["nombrecompleto"] = item[llave].empleado;
      item["numeroEmpleado"] = item[llave].numeroEmpleado;
      item["diaslaborados"] = item[llave].diasLaborados;
      item["percepciones"] = this.cp.transform(item[llave].percepciones);
      item["deducciones"] = this.cp.transform(item[llave].deducciones);
      item["total"] = this.cp.transform(item[llave].total);
    }

    let filas: Array<any> = this.arreglo;

    this.arreglotabla = {
      columnas: columnas,
      filas: filas
    }
  }


  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "desglosar":

        let item = obj.datos;
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave]?.nominaXperiodoId,
          fechaContrato: item[this.llave2].fechaContrato,
          personaId: item[this.llave2].personaId,
          clienteId: item[this.llave2].centrocClienteId
        }

        if (this.nominaSeleccionada.nominaOrdinaria) {

          this.nominaOrdinariaPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            
            this.rellenandoDesglose("detalleNominaEmpleado", datosItem, item);
          });

        } else if (this.nominaSeleccionada.nominaExtraordinaria) {
          this.nominaAguinaldoPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoAguinaldo", datosItem, item);
          });
        }else if(this.nominaSeleccionada.nominaLiquidacion){
          this.nominaFiniquito.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoLiquidacion", datosItem, item);
          });
        }else if(this.nominaSeleccionada.nominaPtu){
          this.nominaPtuPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoPtu", datosItem, item);
          });
        }

        break;
    }
  }

  public regresarOrdinaria() {

    this.navigate.navigate(["/nominas/activas"]);
  }
  public regresarExtraordinaria() {

    this.navigate.navigate(["/nominas/nomina_extraordinaria"]);
  }

  public continuar() {
    this.salida.emit({ type: "calcular" });
  }


  public clonar(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  public rellenandoDesglose(llave2: string, datosItem: any, item: any) {

    let aux: any = this.clonar(datosItem.datos[0][llave2]);
    let deducciones = aux.deducciones;
    let percepciones = aux.percepciones;
    let dias: any = [];
    let otros: any = [];
    for (let llave in aux) {
      if (llave.includes("percepciones") || llave.includes("deducciones")) continue;
      if (llave.includes("dias")) {
        dias.push({ valor: llave.replace(/([A-Z])/g, ' $1'), dato: aux[llave] });
      } else {
        otros.push({ valor: llave.replace(/([A-Z])/g, ' $1'), dato: aux[llave] });
      }

    }

    

    
    
    this.datosDetalleEmpleadoNomina[0]=otros;
    this.datosDetalleEmpleadoNomina[1]= dias;
    this.datosDetalleEmpleadoNomina[2]=percepciones;
    this.datosDetalleEmpleadoNomina[3]= deducciones;
    item.cargandoDetalle = false;
  }

  public descargarNomina(){
    let objEnviar = {
      nominaPeriodoId:this.nominaSeleccionada[this.llave].nominaXperiodoId
    }


    this.cargandoIcon = true;
    this.reportesPrd.getReporteNominasTabCalculados(objEnviar).subscribe(datos =>{
      this.cargandoIcon = false;
      this.reportesPrd.crearArchivo(datos.datos,`nomina_${this.nominaSeleccionada[this.llave].nominaXperiodoId}`,"xlsx");
    });
  }

}
