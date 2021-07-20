import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-timbrar',
  templateUrl: './timbrar.component.html',
  styleUrls: ['./timbrar.component.scss']
})
export class TimbrarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() esDescargar: boolean = false;
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
  public rfc: string = "";
  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public numeroempleado: string = "";
  public continuarTitulo:string = "Continuar";


  @Input() nominaSeleccionada: any;

  constructor(private empleadoPrd: EmpleadosService, private ventana: VentanaemergenteService,
    private modalPrd: ModalService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService, private nominaLiquidacionPrd: NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private nominaPtuPrd: NominaptuService, private configuracionesPrd: ConfiguracionesService, private reportesPrd: ReportesService,
    private usuarioSistemaPrd:UsuarioSistemaService) { }

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


    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      objEnviar.nominaXperiodoId = this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId;
      this.initLiquidacion(objEnviar);
      this.llave = "reciboATimbrarLiquidacion";
      this.llave2 = "nominaLiquidacion";

    } else if (this.nominaSeleccionada.nominaPtu) {
      objEnviar.nominaXperiodoId = this.nominaSeleccionada.nominaPtu?.nominaXperiodoId;
      this.initPtu(objEnviar);
      this.llave = "reciboATimbrarPtu";
      this.llave2 = "nominaPtu";

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

  public initLiquidacion(objEnviar: any) {
    this.nominaLiquidacionPrd.getUsuariosTimbrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);

    });
  }

  public initPtu(objEnviar: any) {
    this.nominaPtuPrd.getUsuariosTimbrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);

    });
  }


  public recibirTabla(obj: any) {

    this.continuarTitulo = (this.arreglo.some((m:any)=>m.seleccionado))? "Timbrar":"Continuar";

    let item = obj.datos;
    switch (obj.type) {

      case "desglosar":
        let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave2]?.nominaXperiodoId,
          fechaContrato: item[this.llave].fechaContrato,
          personaId: item[this.llave].personaId,
          clienteId: item[this.llave].centrocClienteId
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


        } else if (this.nominaSeleccionada.nominaLiquidacion) {

          this.nominaLiquidacionPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminarLiquidacion = datos.datos[0].xmlPreliminarLiquidacion;

            this.datosExtras.datos = xmlPreliminarLiquidacion;
            item.cargandoDetalle = false;
          });


        } else if (this.nominaSeleccionada.nominaPtu) {


          this.nominaPtuPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {

            let xmlPreliminarPtu = datos.datos[0].xmlPreliminarPtu;

            this.datosExtras.datos = xmlPreliminarPtu;
            item.cargandoDetalle = false;
          });


        }




        break;

      case "descargar":
        let enviarObj = {
          nominaPeriodoId: this.nominaSeleccionada[this.llave2]?.nominaXperiodoId,
          idEmpleado: item[this.llave].numeroEmpleado,
          esVistaPrevia: true
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getComprobanteFiscalXML(enviarObj).subscribe(valor => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          
          this.reportesPrd.crearArchivo(valor.datos,"Vista_preliminar_"+ item[this.llave].numeroEmpleado,"pdf")
        });
        break;
    }
  }

  public definirFecha() {
    this.ventana.showVentana(this.ventana.timbrado, { ventanaalerta: true });
  }




  public regresar() {
    this.salida.emit({ type: "calcular" });
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




  public timbrar() {

    if(this.continuarTitulo.includes("Continuar")){
      this.salida.emit({ type: "timbrar" });
      return;
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas timbrar la nómina?").then(valor => {
      if (valor) {




        
        let idCentroCliente = 0;

        let obj = []
        for (let item of this.arreglo) {
          if (item.seleccionado) {
            obj.push({
              nominaPeriodoId: this.nominaSeleccionada[this.llave2].nominaXperiodoId,
              personaId: item[this.llave].personaId,
              fechaContrato: item[this.llave].fechaContrato,
              centroClienteId:  item[this.llave].centroClienteId || this.usuarioSistemaPrd.getIdEmpresa(),//Posiblemente cambio desde el backend con el centro costo cliente...
              usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId,
              servicio: "facturacion_sw"
            });
          }

          idCentroCliente = item[this.llave].centroClienteId || this.usuarioSistemaPrd.getIdEmpresa();
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.nominaOrdinariaPrd.timbrar(obj,idCentroCliente).subscribe((valor) => {

          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if(valor.resultado){
            if (valor.datos.exito) {
              this.modalPrd.showMessageDialog(this.modalPrd.dispersar, "Timbrando", "Espere un momento, el proceso se tardara varios minutos.");
              let suscripcion = timer(0, 1500).pipe(concatMap(() =>
                this.nominaOrdinariaPrd
                  .statusProcesoTimbrar(this.nominaSeleccionada[this.llave2].nominaXperiodoId, obj.length)))
                .subscribe(datos => {
                  this.configuracionesPrd.setCantidad(datos.datos);
                  if (datos.datos >= 100) {
                    suscripcion.unsubscribe();
                    this.configuracionesPrd.setCantidad(0);
                    this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                    this.ventana.showVentana(this.ventana.ntimbrado, { datos: this.nominaSeleccionada[this.llave2].nominaXperiodoId }).then(() => {
                      this.salida.emit({ type: "timbrar" });
                    });
                  }
                });
            }
          }else{
            this.modalPrd.showMessageDialog(valor.resultado,valor.mensaje);
          }
        });
      }
    });
  }


  public filtrar() {


    let objenviar = {
      nominaXperiodoId: this.nominaSeleccionada[this.llave2].nominaXperiodoId,
      numeroempleado: this.numeroempleado,
      apellidoMaterno: this.apellidoMaterno,
      apellidoPaterno: this.apellidoPaterno,
      nombreEmpleado: this.nombre,
      rfc: this.rfc
    }


    this.cargando = true;


    if (this.nominaSeleccionada.nominaOrdinaria) {

      this.nominaOrdinariaPrd.getUsuariosTimbradoFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenarTablas(datos);

      });

    } if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.nominaAguinaldoPrd.getUsuariosTimbradoFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenarTablas(datos);

      });

    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.nominaLiquidacionPrd.getUsuariosTimbradoFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenarTablas(datos);

      });
    } else if (this.nominaSeleccionada.nominaPtu) {


      this.nominaPtuPrd.getUsuariosTimbradoFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.rellenarTablas(datos);

      });

    }

  }

}
