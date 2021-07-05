import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval, timer } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { tabla } from 'src/app/core/data/tabla';
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
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  @Input() nominaSeleccionada: any;
  @Input() esDescargar: boolean = false;

  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public cargandoIconDispersion: boolean = false;
  public objEnviar: any = [];
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public nominaLiquidacion: boolean = false;
  public nominaPtu: boolean = false;
  public llave: string = "";
  public llave2:string = "";


  public rfc: string = "";
  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public numeroempleado: string = "";

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public arreglo: any = [];

  public idnominaPeriodo: number = -1;

  constructor(private modalPrd: ModalService,
    private ventana: VentanaemergenteService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService, private nominaLiquidacionPrd: NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private reportes: ReportesService, private nominaPtuPrd: NominaptuService,
    private configuracionesPrd: ConfiguracionesService, private usuariosSistemaPrd: UsuarioSistemaService) { }



  ngOnInit(): void {
    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.llave = "nominaOrdinaria";
      this.nominaOrdinaria = true;
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId
      }

      this.idnominaPeriodo = this.nominaSeleccionada.nominaOrdinaria?.nominaXperiodoId;
      this.cargando = true;
      this.llave2 = "empleadoApago";
      this.nominaOrdinariaPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos, "empleadoApago");
      });
    } else if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.llave = "nominaExtraordinaria";
      this.nominaExtraordinaria = true;
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId
      }
      this.idnominaPeriodo = this.nominaSeleccionada.nominaExtraordinaria?.nominaXperiodoId;
      this.cargando = true;
      this.llave2 = "empleadoApagoAguinaldo";
      this.nominaAguinaldoPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos, "empleadoApagoAguinaldo");
      });
    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
      this.nominaLiquidacion = true;
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId
      }
      this.idnominaPeriodo = this.nominaSeleccionada.nominaLiquidacion?.nominaXperiodoId;
      this.cargando = true;
      this.llave2 = "empleadoApagoLiquidacion";
      this.nominaLiquidacionPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos, "empleadoApagoLiquidacion");
      });
    } else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
      this.nominaPtu = true;
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaPtu?.nominaXperiodoId
      }
      this.idnominaPeriodo = this.nominaSeleccionada.nominaPtu?.nominaXperiodoId;
      this.cargando = true;
      this.llave2 = "empleadoApagoPtu";
      this.nominaPtuPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos, "empleadoApagoPtu");
      });
    }
  }




  public crearTabla(datos: any, llave: string) {
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("rfc", "RFC", false, false, true),
      new tabla("banco", "Banco", false, false, true),
      new tabla("total", "Total", false, false, true),
      new tabla("tipopago", "Tipo de pago", false, false, true),
      new tabla("status", "Estatus ", false, false, true)
    ];
    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item["nombrecompleto"] = item[llave].nombreEmpleado + " " + item[llave].apellidoPatEmpleado + " ";
        item["nombrecompleto"] += (item[llave].apellidoMatEmpleado == undefined) ? "" : item[llave].apellidoMatEmpleado;
        item["rfc"] = item[llave].rfc;
        item["banco"] = item[llave].banco;
        item["tipopago"] = item[llave].tipoPago;
        item["total"] = this.cp.transform(item[llave].totalNetoEndinero);
        item["status"] = item[llave].status;
      }
    }
    let filas: Array<any> = this.arreglo;
    this.arreglotabla = {
      columnas: columnas,
      filas: filas
    }
    this.cargando = false;
  }

  public continuar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas continuar?").then(valor => {
      if (valor) {
        this.salida.emit({ type: "dispersar" });
      }
    });
  }

  public recibirTabla(obj: any) {


    

  }

  public regresar() {

  }

  public dispersar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas dispersar la nómina?").then(valor => {
      if (valor) {


        


        let obj = []
        for (let item of this.arreglo) {
          if (item.seleccionado) {
            obj.push({
              nominaPeriodoId: this.idnominaPeriodo,
              personaId: item[this.llave2].personaId,
              fechaContrato: item[this.llave2].fechaContrato,
              centroClienteId: item[this.llave2].centroClienteId,
              usuarioId: this.usuariosSistemaPrd.getUsuario().usuarioId,
              servicio: "dispersion_st"
            });
          }
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.nominaOrdinariaPrd.dispersar(obj).subscribe((valor) => {
          console.log(valor,"Esto ya se anda dispersando");
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if (valor.datos.exito) {
            this.modalPrd.showMessageDialog(this.modalPrd.dispersar, "Dispersando", "Espere un momento, el proceso se tardara varios minutos.");
         let suscribe =    timer(0, 1500).pipe(concatMap(() =>
              this.nominaOrdinariaPrd
                .statusProcesoDispersar(this.idnominaPeriodo, obj.length)))
              .subscribe(datos => {
                this.configuracionesPrd.setCantidad(datos.datos);
                if (datos.datos >=30) {
                  suscribe.unsubscribe();
                  setTimeout(() => {
                    
                    this.configuracionesPrd.setCantidad(0);
                    this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                    this.ventana.showVentana(this.ventana.ndispersion, { datos: this.idnominaPeriodo }).then(valor => {
                      this.salida.emit({ type: "dispersar" });
                    });
                  }, 2000);
                }
              });
          }
        });





      }
    });
  }


  public descargarDispersion() {
    this.cargandoIconDispersion = true;
    let obj = {
      nominaPeriodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
      esVistaPrevia: true
    }
    this.reportes.getlayoutDispersionNomina(obj).subscribe(datos => {
      this.cargandoIconDispersion = false;
      this.reportes.crearArchivo(datos.datos, `Archivo_dispersion_${this.nominaSeleccionada[this.llave].nombreNomina.replace(" ", ".")}`, "xlsx");
    });
  }


  public descargarRfc() {
    this.cargandoIcon = true;
    this.reportes.getDescargarTxtRfctabDispersar(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.cargandoIcon = false;
      this.reportes.crearArchivo(datos.datos, `archivoRFCs_${this.usuariosSistemaPrd.getIdEmpresa()}`, "txt");
    });
  }


  public filtrar() {
    let objenviar = {
      nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
      numeroempleado: this.numeroempleado,
      apellidoMaterno: this.apellidoMaterno,
      apellidoPaterno: this.apellidoPaterno,
      nombreEmpleado: this.nombre,
      rfc: this.rfc
    }


    this.cargando = true;

    if (this.nominaSeleccionada.nominaOrdinaria) {

      this.nominaOrdinariaPrd.getUsuariosDispersionFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.crearTabla(datos, "empleadoApago");

      });

    } if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.nominaAguinaldoPrd.getUsuariosDispersionFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.crearTabla(datos, "empleadoApagoAguinaldo");

      });

    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.nominaLiquidacionPrd.getUsuariosDispersionFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.crearTabla(datos, "empleadoApagoLiquidacion");

      });
    } else if (this.nominaSeleccionada.nominaPtu) {


      this.nominaPtuPrd.getUsuariosDispersionFiltrar(objenviar).subscribe(datos => {
        this.cargando = false;
        this.arreglo = datos.datos;
        this.crearTabla(datos, "empleadoApagoPtu");

      });

    }
  }

}
