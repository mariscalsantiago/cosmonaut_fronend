import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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

  public esnormal:boolean = false;


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
      this.esnormal = true;
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
    console.log("TABKLAS",obj.datos);

    this.continuarTitulo = (this.arreglo.some((m:any)=>m.seleccionado && m.status !== 'Correcto' && m.statuspago === 'Pagado'))? "Timbrar":"Continuar";

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
            xmlPreliminar = this.alineandoDinamicoPagos(xmlPreliminar);

            this.datosExtras.datos = xmlPreliminar;
            item.cargandoDetalle = false;
            console.log(xmlPreliminar);
            console.log("jojoi");
          });

        } else if (this.nominaSeleccionada.nominaExtraordinaria) {

          this.nominaAguinaldoPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminarAguinaldo = datos.datos[0].xmlPreliminarAguinaldo;
            xmlPreliminarAguinaldo = this.alineandoDinamicoPagos(xmlPreliminarAguinaldo);
            this.datosExtras.datos = xmlPreliminarAguinaldo;
            item.cargandoDetalle = false;
            console.log(xmlPreliminarAguinaldo);
          });


        } else if (this.nominaSeleccionada.nominaLiquidacion) {

          this.nominaLiquidacionPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {
            let xmlPreliminarLiquidacion = datos.datos[0].xmlPreliminarLiquidacion;
            xmlPreliminarLiquidacion = this.alineandoDinamicoPagos(xmlPreliminarLiquidacion);
            this.datosExtras.datos = xmlPreliminarLiquidacion;
            item.cargandoDetalle = false;
            console.log(xmlPreliminarLiquidacion);
          });


        } else if (this.nominaSeleccionada.nominaPtu) {


          this.nominaPtuPrd.getUsuariosTimbradoDetalle(objEnviar).subscribe(datos => {

            let xmlPreliminarPtu = datos.datos[0].xmlPreliminarPtu;
            xmlPreliminarPtu = this.alineandoDinamicoPagos(xmlPreliminarPtu);
            this.datosExtras.datos = xmlPreliminarPtu;
            item.cargandoDetalle = false;
            console.log(xmlPreliminarPtu);
          });


        }
        break;

      case "descargar":
        let enviarObj = {
          nominaPeriodoId: this.nominaSeleccionada[this.llave2]?.nominaXperiodoId,
          idEmpleado: item[this.llave].personaId,
          esZip: false,
          clienteId:this.usuarioSistemaPrd.getIdEmpresa()
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if(this.nominaSeleccionada.nominaOrdinaria){
          this.reportesPrd.getComprobanteFiscalXMLOrdinarias(enviarObj).subscribe(valor => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            
            this.reportesPrd.crearArchivo(valor.datos,"Vista_preliminar_"+ item[this.llave].numEmpleado,"pdf")
          });
        }else{
          this.reportesPrd.getComprobanteFiscalXMLExtraordinarias(enviarObj).subscribe(valor => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            
            this.reportesPrd.crearArchivo(valor.datos,"Vista_preliminar_"+ item[this.llave].numEmpleado,"pdf")
          });
        }
      
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
      new tabla("nombrecompleto", "Nombre"),
      new tabla("tipo", "Método de pago", false, false, true),
      new tabla("total", "Total neto", false, false, true),
      new tabla("statuspago", "Estatus pago", false, false, true),
      new tabla("status", "Estatus timbre", false, false, true)

    ];
    for (let item of this.arreglo) {
      item["nombrecompleto"] = item[this.llave]?.nombre + " " + item[this.llave]?.apellidoPat + " "+(item[this.llave]?.apellidoMat || '');
      item["tipo"] = item[this.llave]?.metodoPago;
      item["total"] = this.cp.transform(item[this.llave]?.totalNeto);
      item["fecha"] = item[this.llave]?.fechaPagoTimbrado;
      item["status"] = item[this.llave]?.estatusTimbre;
      item["statuspago"] = item[this.llave]?.estadoPagoDescripcion;
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
        let arregloaux:Array<Number> = new Array<Number>();

        for (let item of this.arreglo) {
          if (item.seleccionado && item.status !== 'Correcto' && item.statuspago === 'Pagado') {
            obj.push({
              nominaPeriodoId: this.nominaSeleccionada[this.llave2].nominaXperiodoId,
              personaId: item[this.llave].personaId,
              fechaContrato: item[this.llave].fechaContrato,
              centroClienteId:  item[this.llave].centroClienteId || this.usuarioSistemaPrd.getIdEmpresa(),//Posiblemente cambio desde el backend con el centro costo cliente...
              usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId
            });
            arregloaux.push(item[this.llave].personaId);
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
                  .statusProcesoTimbrar(this.nominaSeleccionada[this.llave2].nominaXperiodoId, obj.length,arregloaux)))
                .subscribe(datos => {
                  this.configuracionesPrd.setCantidad(datos.datos);
                  if (datos.datos >= 100) {
                    suscripcion.unsubscribe();
                    setTimeout(() => {
                      this.configuracionesPrd.setCantidad(0);
                    this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                    this.ventana.showVentana(this.ventana.ntimbrado, {datos:{ nominaId: this.nominaSeleccionada[this.llave2].nominaXperiodoId,empleados:arregloaux }}).then(() => {
                      this.ngOnInit();
                      this.continuarTitulo = "Continuar";
                    });
                    }, 2000);
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
      numeroempleado: this.numeroempleado || undefined,
      apellidoMaterno: this.apellidoMaterno || undefined,
      apellidoPaterno: this.apellidoPaterno || undefined,
      nombreEmpleado: this.nombre || undefined,
      rfc: this.rfc || undefined
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


  public descargarNomina(){
    let objEnviar = {
      nominaPeriodoId: this.nominaSeleccionada[this.llave2].nominaXperiodoId
    }

    this.cargandoIcon = true;
    if(this.esnormal){
      this.reportesPrd.getReporteNominasTabCalculados(objEnviar).subscribe(datos => {
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${this.nominaSeleccionada[this.llave2].nombreNomina}_${this.nominaSeleccionada[this.llave2].periodo}`, "xlsx");
      });
    }else{
      this.reportesPrd.getReporteNominasTabCalculadosEspeciales(objEnviar).subscribe(datos => {
        
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${this.nominaSeleccionada[this.llave2].nombreNomina}_${this.nominaSeleccionada[this.llave2].periodo}`, "xlsx");
      });
    }
  }

  public actualizarLista(){
    this.ngOnInit();
  }

  private alineandoDinamicoPagos(obj:any){
    if(obj.percepciones && obj.deducciones){
      if(obj.percepciones.length > (obj.deducciones.length) || 0){
        let cantidad = obj.percepciones.length;
        this.acomodando(cantidad,obj.deducciones);
      }else if(obj.deducciones.length > (obj.percepciones.length) || 0){
        let cantidad = obj.deducciones.length;
        this.acomodando(cantidad,obj.percepciones);
      }
    }
    return obj;
  }

  private acomodando(cantidad:number,obj:any){
    let indice = cantidad - obj.length;
    for(let x = 0; x < indice; x++){
        obj.push({
          concepto:'',
          montoCuota:'',
          montoTotal:'',
          montoGravable:'',
          montoExento:''
        });
    }
  }

}
