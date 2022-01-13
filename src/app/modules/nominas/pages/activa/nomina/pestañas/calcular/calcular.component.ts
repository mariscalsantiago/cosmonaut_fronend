import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { ServerSentEventService } from 'src/app/shared/services/nominas/server-sent-event.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';



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
  @Input() empleados: any;
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

  public ocultarEliminar: boolean = false;

  public datosDetalleEmpleadoNomina: any = [];

  public cargandoIcon: boolean = false;


  public arreglo: any = [];


  public rfc: any = "";
  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public numeroempleado: string = "";
  public idEmpleado: number = -1;

  public esnormal: boolean = false;

  constructor(private navigate: Router,
    private modalPrd: ModalService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService, private nominaFiniquito: NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private nominaPtuPrd: NominaptuService, private reportesPrd: ReportesService,
    private usuariSistemaPrd: UsuarioSistemaService, private ventana: VentanaemergenteService,
    private bancosPrd: CuentasbancariasService, private eventoPrd: EventosService) { }

  ngOnInit(): void {

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
    } else if (this.nominaSeleccionada.nominaPtu) {
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
    debugger;

    this.ocultarEliminar = this.nominaSeleccionada[this.llave].estadoActualNomina === "Calculada" || this.nominaSeleccionada[this.llave].estadoActualNomina === "Nueva";
  }


  public rellenandoTablas(llave: string) {
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("numeroEmpleado", "Número de empleado", false, false, true),
      new tabla("fecha", "Fecha antigüedad"),
      new tabla("diaslaborados", "Días laborados", false, false, true),
      new tabla("percepciones", "Percepciones", false, false, true),
      new tabla("deducciones", "Deducciones", false, false, true),
      new tabla("total", "Total", false, false, true)
    ];


    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item["nombrecompleto"] = `${item[llave].nombre} ${item[llave].apellidoPat} ${item[llave].apellidoMat || ''}`;
        item["numeroEmpleado"] = item[llave].numEmpleado;
        item["diaslaborados"] = item[llave].diasLaborados;
        item["fecha"] = new DatePipe("es-MX").transform(item[llave].fechaCalculo,"dd-MMM-yyyy")?.replace(".",""),
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


  private patronalSeleccionado: any = {
    nominaXperiodoId: 722,
    fechaContrato: "string",
    personaId: 0,
    clienteId: 0,
    usuarioId: 0
  };

  public patronal: any = { datos: [] };

  public recibirTabla(obj: any) {
    debugger;
    switch (obj.type) {
      case "desglosar":

        let item = obj.datos;
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave]?.nominaXperiodoId,
          fechaContrato: item[this.llave2].fechaContrato,
          personaId: item[this.llave2].personaId,
          clienteId: item[this.llave2].centrocClienteId
        }

        this.patronalSeleccionado.nominaXperiodoId = this.nominaSeleccionada[this.llave]?.nominaXperiodoId;
        this.patronalSeleccionado.fechaContrato = item[this.llave2].fechaContrato;
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
        } else if (this.nominaSeleccionada.nominaLiquidacion) {
          this.nominaOrdinariaPrd.verImssPatronal(this.patronalSeleccionado).subscribe(datos => {
            this.patronal.datos = datos.datos;

          });
        }


        break;
      case 'isn':
        this.nominaOrdinariaPrd.verIsn(this.patronalSeleccionado.nominaXperiodoId, this.patronalSeleccionado.personaId).subscribe(datos => {
          this.patronal.datos = datos.datos;
        });
        break;
        case "percepcion":

          if (this.nominaSeleccionada.nominaOrdinaria) {
            this.agregarPer(obj.datos.calculoEmpleado);

          } else if (this.nominaSeleccionada.nominaExtraordinaria) {
            this.agregarPer(obj.datos.calculoEmpleadoAguinaldo);

          } else if (this.nominaSeleccionada.nominaLiquidacion) {
            this.agregarPer(obj.datos.calculoEmpleadoLiquidacion);

          } else if (this.nominaSeleccionada.nominaPtu) {
            this.agregarPer(obj.datos.calculoEmpleadoPtu);
          }
        break;  
        case "deduccion":

          if (this.nominaSeleccionada.nominaOrdinaria) {
            this.agregarDed(obj.datos.calculoEmpleado);

          } else if (this.nominaSeleccionada.nominaExtraordinaria) {
            this.agregarDed(obj.datos.calculoEmpleadoAguinaldo);

          } else if (this.nominaSeleccionada.nominaLiquidacion) {
            this.agregarDed(obj.datos.calculoEmpleadoLiquidacion);

          } else if (this.nominaSeleccionada.nominaPtu) {
            this.agregarDed(obj.datos.calculoEmpleadoPtu);
          }
        break; 
        case "evento":

          if (this.nominaSeleccionada.nominaOrdinaria) {
            this.agregarEvento(obj.datos.calculoEmpleado);

          } else if (this.nominaSeleccionada.nominaExtraordinaria) {
            this.agregarEvento(obj.datos.calculoEmpleadoAguinaldo);

          } else if (this.nominaSeleccionada.nominaLiquidacion) {
            this.agregarEvento(obj.datos.calculoEmpleadoLiquidacion);

          } else if (this.nominaSeleccionada.nominaPtu) {
            this.agregarEvento(obj.datos.calculoEmpleadoPtu);
          }
        break;         
    }
  }


  public agregarPer(obj: any) {
    debugger;
    let esnomina = true;
    this.idEmpleado = obj.personaId;
    let datosPer: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariSistemaPrd.getIdEmpresa(),
      nominas: esnomina
      
    };
    this.ventana.showVentana(this.ventana.percepciones, { datos: datosPer }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaPercepcion(valor.datos);
      }
    });
  }

  public agregarEvento(obj: any) {
    debugger;
    this.idEmpleado = obj.personaId;
    let datosEve: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariSistemaPrd.getIdEmpresa(),
      fechaContrato: obj.fechaContrato      
    };
    this.ventana.showVentana(this.ventana.eventos, { datos: datosEve }).then(valor => {
      if (valor.datos) {

        this.guardarEvento(valor.datos);
      }
    });
  }

  public guardarEvento(evento:any) {
    debugger;
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.eventoPrd.save(evento).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
      });
    })

  }

  public agregarDed(obj: any) {
    debugger;
    let esnomina = true;
    this.idEmpleado = obj.personaId;

    let datosDed: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariSistemaPrd.getIdEmpresa(),
      nominas: esnomina
    };
    this.ventana.showVentana(this.ventana.deducciones, { datos: datosDed }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaDeduccion(valor.datos);
      }
    });
  }

  public agregarNuevaPercepcion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.savePercepcionEmpleado(obj).subscribe(datos => {

      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);

    });
  }


  public agregarNuevaDeduccion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.saveDeduccionEmpleado(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);

    });
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
      if (llave.includes("dias") || llave.includes("horas")) {
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
                this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(),this.nominaSeleccionada[this.llave].nominaXperiodoId);
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaExtraordinaria") {

          this.nominaAguinaldoPrd.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(),this.nominaSeleccionada[this.llave].nominaXperiodoId);
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaLiquidacion") {

          this.nominaFiniquito.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(),this.nominaSeleccionada[this.llave].nominaXperiodoId);
                this.regresarExtraordinaria();
              }
            });
          });
        } else if (this.llave == "nominaPtu") {

          this.nominaPtuPrd.recalcularNomina(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(),this.nominaSeleccionada[this.llave].nominaXperiodoId);
                this.regresarExtraordinaria();
              }
            });
          });
        }
      }
    });
  }

  public verListado() {
    this.ventana.showVentana(this.ventana.listadoEmpleados, { datos: this.empleados });
  }

}
