import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada: any;
  public cargando: boolean = false;
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public nominaLiquidacion:boolean = false;
  public objEnviar: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public llave: string = "";

  public datosDetalleEmpleadoNomina: any = [];

  public cargandoIcon: boolean = false;


  public arreglo: any = [];

  constructor(private navigate: Router,
    private modalPrd: ModalService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService,private nominaFiniquito:NominafiniquitoliquidacionService, private cp: CurrencyPipe) { }

  ngOnInit(): void {



    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.llave = "nominaOrdinaria";
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

      this.nominaExtraordinaria = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId
      }

      this.nominaAguinaldoPrd.getUsuariosCalculados(this.objEnviar).subscribe(datos => {

        console.log("SI ES EXTRAORDINARIA");
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoAguinaldo");
      });

    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
      this.nominaLiquidacion = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId
      }

      this.nominaFiniquito.getUsuariosCalculados(this.objEnviar).subscribe(datos => {

        console.log("SI ES FINIQUITO");
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoLiquidacion");
      });
    }



  }


  public rellenandoTablas(llave: string) {
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("numEmpleado", "Número de empleado", false, false, true),
      new tabla("diaslaborados", "Días laborados", false, false, true),
      new tabla("percepciones", "Percepciones", false, false, true),
      new tabla("deducciones", "Deducciones", false, false, true),
      new tabla("total", "Total", false, false, true)
    ];


    for (let item of this.arreglo) {
      item["nombrecompleto"] = item[llave].empleado;
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
          fechaContrato: item.fechaContrato,
          personaId: item.personaId,
          clienteId: item.centrocClienteId
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

    this.datosDetalleEmpleadoNomina.push(otros);
    this.datosDetalleEmpleadoNomina.push(dias);
    this.datosDetalleEmpleadoNomina.push(percepciones);
    this.datosDetalleEmpleadoNomina.push(deducciones);
    item.cargandoDetalle = false;
  }

}
