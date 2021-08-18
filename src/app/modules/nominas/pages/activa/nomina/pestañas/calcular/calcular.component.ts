import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-calcular',
  templateUrl: './calcular.component.html',
  styleUrls: ['./calcular.component.scss']
})
export class CalcularComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada: any;
  @Input() esEliminar: boolean = false;
  @Input() esDescargar: boolean = false;
  public cargando: boolean = false;
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public nominaLiquidacion: boolean = false;
  public nominaPtu: boolean = false;
  public objEnviar: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public llave: string = "";
  public llave2: string = "";

  public ocultarEliminar:boolean = false;

  public datosDetalleEmpleadoNomina: any = [];

  public cargandoIcon: boolean = false;


  public arreglo: any = [];


  public rfc: any = "";
  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public numeroempleado: string = "";

  public esnormal: boolean = false;

  constructor(private navigate: Router,
    private modalPrd: ModalService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService, private nominaFiniquito: NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private nominaPtuPrd: NominaptuService, private reportesPrd: ReportesService,
    private usuariSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {
    console.log("Esta es la nomina",this.nominaSeleccionada);
    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.esnormal = true;
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
      this.ocultarEliminar = this.nominaSeleccionada.nominaExtraordinaria?.estadoActualNomina !== "Calculada";

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
      this.ocultarEliminar = this.nominaSeleccionada.nominaLiquidacion?.estadoActualNomina !== "Calculada";

      this.nominaFiniquito.getUsuariosCalculados(this.objEnviar).subscribe(datos => {


        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoLiquidacion");
      });
    } else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
      this.llave2 = "calculoEmpleadoPtu";
      this.nominaPtu = true;

      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaPtu?.nominaXperiodoId
      }
      this.ocultarEliminar = this.nominaSeleccionada.nominaPtu?.estadoActualNomina !== "Calculada";

      this.nominaPtuPrd.getUsuariosCalculados(this.objEnviar).subscribe(datos => {


        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoPtu");
      });
    }


    this.ocultarEliminar = this.nominaSeleccionada[this.llave].estadoActualNomina === "Calculada" || this.nominaSeleccionada[this.llave].estadoActualNomina === "Nueva";
  }


  public rellenandoTablas(llave: string) {
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("numeroEmpleado", "Número de empleado", false, false, true),
      new tabla("fecha","Fecha contrato"),
      new tabla("diaslaborados", "Días laborados", false, false, true),
      new tabla("percepciones", "Percepciones", false, false, true),
      new tabla("deducciones", "Deducciones", false, false, true),
      new tabla("total", "Total", false, false, true)
    ];


    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {


        console.log("Esta es la fecha contrato",new DatePipe("es-MX").transform(new Date(new Date(item[llave].fechaContrato).toUTCString().replace("GMT","")), 'yyyy-MM-dd'));

        item["nombrecompleto"] = `${item[llave].nombre} ${item[llave].apellidoPat} ${item[llave].apellidoMat || ''}`;
        item["numeroEmpleado"] = item[llave].numEmpleado;
        item["diaslaborados"] = item[llave].diasLaborados;
        item["fecha"] = new DatePipe("es-MX").transform(new Date(new Date(item[llave].fechaContrato).toUTCString().replace("GMT","")), 'yyyy-MM-dd'),
        item["percepciones"] = this.cp.transform(item[llave].totalPercepciones);
        item["deducciones"] = this.cp.transform(item[llave].totalDeducciones);
        item["total"] = this.cp.transform(item[llave].total);
      }
    }

    let filas: Array<any> = this.arreglo;

    this.arreglotabla = {
      columnas: columnas,
      filas: filas
    }
  }


  private patronalSeleccionado:any = {
    nominaXperiodoId: 722,
    fechaContrato: "string",
    personaId: 0,
    clienteId: 0,
    usuarioId: 0
  };

  public patronal:any = {datos:[]};

  public recibirTabla(obj: any) {
    

    switch (obj.type) {
      case "desglosar":

        let item = obj.datos;
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave]?.nominaXperiodoId,
          fechaContrato:new DatePipe("es-MX").transform(new Date(new Date(item[this.llave2].fechaContrato).toUTCString().replace("GMT","")), 'yyyy-MM-dd'),
          personaId: item[this.llave2].personaId,
          clienteId: item[this.llave2].centrocClienteId
        }

        this.patronalSeleccionado.nominaXperiodoId = this.nominaSeleccionada[this.llave]?.nominaXperiodoId;
        this.patronalSeleccionado.fechaContrato = new DatePipe("es-MX").transform(new Date(new Date(item[this.llave2].fechaContrato).toUTCString().replace("GMT","")), 'yyyy-MM-dd');
        this.patronalSeleccionado.personaId = item[this.llave2].personaId;
        this.patronalSeleccionado.clienteId = item[this.llave2].centrocClienteId;
        this.patronalSeleccionado.usuarioId = this.usuariSistemaPrd.usuario.usuarioId;

        if (this.nominaSeleccionada.nominaOrdinaria) {

          this.nominaOrdinariaPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {

            this.rellenandoDesglose("detalleNominaEmpleado", datosItem, item);
          });

        } else if (this.nominaSeleccionada.nominaExtraordinaria) {
          this.nominaAguinaldoPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoAguinaldo", datosItem, item);
          });
        } else if (this.nominaSeleccionada.nominaLiquidacion) {
          this.nominaFiniquito.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoLiquidacion", datosItem, item);
          });
        } else if (this.nominaSeleccionada.nominaPtu) {
          this.nominaPtuPrd.getUsuariosCalculadosDetalle(objEnviar).subscribe(datosItem => {
            this.rellenandoDesglose("detalleNominaEmpleadoPtu", datosItem, item);
          });
        }

        break;
      case 'patronal':
        if (this.nominaSeleccionada.nominaOrdinaria) {
          this.nominaOrdinariaPrd.verImssPatronal(this.patronalSeleccionado).subscribe(datos => {
               this.patronal.datos = datos.datos;
               
          });
        }
        break;
    }
  }

  public regresarOrdinaria() {

    this.navigate.navigate(["/nominas/activas"]);
  }
  public regresarExtraordinaria() {

    if (this.llave == "nominaOrdinaria") {
      this.navigate.navigate(["/nominas/activas"]);
    } else if (this.llave == "nominaExtraordinaria") {
      this.navigate.navigate(["/nominas/nomina_extraordinaria"]);
    } else if (this.llave == "nominaLiquidacion") {
      this.navigate.navigate(["/nominas/finiquito_liquidacion"]);
    } else if (this.llave == "nominaPtu") {
      this.navigate.navigate(["/nominas/ptu"]);
    }
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


    





    this.datosDetalleEmpleadoNomina[0] = otros;
    this.datosDetalleEmpleadoNomina[1] = dias;
    this.datosDetalleEmpleadoNomina[2] = percepciones;
    this.datosDetalleEmpleadoNomina[3] = deducciones;
    item.cargandoDetalle = false;
  }

  public descargarNomina() {
    let objEnviar = {
      nominaPeriodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId
    }


    
    this.cargandoIcon = true;
    if (this.esnormal) {
      this.reportesPrd.getReporteNominasTabCalculados(objEnviar).subscribe(datos => {
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`, "xlsx");
      });
    } else {
      this.reportesPrd.getReporteNominasTabCalculadosEspeciales(objEnviar).subscribe(datos => {
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`, "xlsx");
      });
    }
  }

  public filtrar() {
    let objenviar = {
      nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
      numeroempleado: this.numeroempleado || undefined,
      apellidoMaterno: this.apellidoMaterno || undefined,
      apellidoPaterno: this.apellidoPaterno || undefined,
      nombreEmpleado: this.nombre || undefined,
      rfc: this.rfc || undefined
    }


    this.cargando = true;

    if (this.nominaSeleccionada.nominaOrdinaria) {

      this.nominaOrdinariaPrd.getUsuariosCalculadosFiltrado(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleado");

      });

    } if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.nominaAguinaldoPrd.getUsuariosCalculadosFiltrado(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoAguinaldo");

      });

    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.nominaFiniquito.getUsuariosCalculadosFiltrado(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoLiquidacion");

      });
    } else if (this.nominaSeleccionada.nominaPtu) {


      this.nominaPtuPrd.getUsuariosCalculadosFiltrado(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenandoTablas("calculoEmpleadoPtu");

      });

    }
  }



  public eliminar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la nómina?").then(valor => {
      if (valor) {
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        };

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if (this.llave == "nominaOrdinaria") {
          this.nominaOrdinariaPrd.eliminar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaExtraordinaria") {
          this.nominaAguinaldoPrd.eliminar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaLiquidacion") {
          this.nominaFiniquito.eliminar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaPtu") {
          this.nominaPtuPrd.eliminar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        }
      }
    });

  }

  public recalcular() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, '¿Deseas recalcular la nómina?').then(valor => {
      if (valor) {

        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa(),
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        }
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if (this.llave == "nominaOrdinaria") {

          this.nominaOrdinariaPrd.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        }else  if (this.llave == "nominaExtraordinaria") {

          this.nominaAguinaldoPrd.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        }else  if (this.llave == "nominaLiquidacion") {

          this.nominaFiniquito.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        }else  if (this.llave == "nominaPtu") {

          this.nominaPtuPrd.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.regresarExtraordinaria();
              }
            });
          });
        }
      }
    });
  }

}
