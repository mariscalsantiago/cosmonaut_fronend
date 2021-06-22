import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
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
  @Input() esDescargar:boolean = false;

  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public cargandoIconDispersion:boolean = false;
  public objEnviar: any = [];
  public nominaOrdinaria: boolean = false;
  public nominaExtraordinaria: boolean = false;
  public nominaLiquidacion: boolean = false;
  public nominaPtu:boolean = false;
  public llave: string = "";

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public arreglo: any = [];

  public idnominaPeriodo:number = -1;

  constructor(private modalPrd: ModalService,
    private ventana: VentanaemergenteService, private nominaOrdinariaPrd: NominaordinariaService,
    private nominaAguinaldoPrd: NominaaguinaldoService, private nominaLiquidacionPrd: NominafiniquitoliquidacionService, private cp: CurrencyPipe,
    private reportes:ReportesService,private nominaPtuPrd:NominaptuService,
    private configuracionesPrd:ConfiguracionesService,private usuariosSistemaPrd:UsuarioSistemaService) { }



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
      this.nominaOrdinariaPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos,"empleadoApago");
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
      this.nominaAguinaldoPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos,"empleadoApagoAguinaldo");
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
      this.nominaLiquidacionPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos,"empleadoApagoLiquidacion");
      });
    }else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
      this.nominaPtu = true;
      this.cargando = true;
      this.objEnviar = {
        nominaXperiodoId: this.nominaSeleccionada.nominaPtu?.nominaXperiodoId
      }
      this.idnominaPeriodo = this.nominaSeleccionada.nominaPtu?.nominaXperiodoId;
      this.cargando = true;
      this.nominaPtuPrd.getUsuariosDispersion(this.objEnviar).subscribe(datos => {
        this.crearTabla(datos,"empleadoApagoPtu");
      });
    }
  }




  public crearTabla(datos: any,llave:string) {
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("nombrecompleto", "Nombre"),
      new tabla("rfc", "RFC", false, false, true),
      new tabla("banco", "Banco", false, false, true),
      new tabla("total", "Total", false, false, true),
      new tabla("tipopago", "Tipo de pago", false, false, true),
      new tabla("status", "Estatus ", false, false, true)
    ];
    for (let item of this.arreglo) {
      item["nombrecompleto"] = item[llave].nombreEmpleado + " " + item[llave].apellidoPatEmpleado + " ";
      item["nombrecompleto"] += (item[llave].apellidoMatEmpleado == undefined) ? "" : item[llave].apellidoMatEmpleado;
      item["rfc"] = item[llave].rfc;
      item["banco"] = item[llave].banco;
      item["tipopago"] = item[llave].tipoPago;
      item["total"] = this.cp.transform(item[llave].totalNetoEndinero);
      item["status"] = item[llave].status;
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
        for(let item of this.arreglo){
            if(item.seleccionado){
                obj.push(   {
                  nominaPeriodoId: this.idnominaPeriodo,
                  personaId: item.personaId,
                  fechaContrato: item.fechaContrato,
                  centroClienteId: item.centroClienteId,
                  usuarioId: this.usuariosSistemaPrd.getUsuario().usuarioId,
                  servicio: "dispersion_st"
              });
            }
        }


        this.nominaOrdinariaPrd.dispersar(obj).subscribe(()=>{
          this.modalPrd.showMessageDialog(this.modalPrd.dispersar,"Dispersando","Espere un momento, el proceso se tardara varios minutos.");
          let intervalo = interval(1000);
          intervalo.pipe(take(11));
          intervalo.subscribe((valor)=>{
            this.configuracionesPrd.setCantidad(valor*10);
            if(valor == 10){
              this.configuracionesPrd.setCantidad(0);
               this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
               this.ventana.showVentana(this.ventana.ndispersion,{datos:this.idnominaPeriodo}).then(valor => {
                this.salida.emit({ type: "dispersar" });
              });
            }
          });
        });

        
      

      
      }
    });
  }


  public descargarDispersion(){
      this.cargandoIconDispersion = true;
      let obj = {
      nominaPeriodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
        esVistaPrevia: true
      }
      this.reportes.getlayoutDispersionNomina(obj).subscribe(datos =>{
        this.cargandoIconDispersion = false;
        this.reportes.crearArchivo(datos.datos,`Archivo_dispersion_${this.nominaSeleccionada[this.llave].nombreNomina.replace(" ",".")}`,"xlsx");
      });
  }


  public descargarRfc(){
    this.cargandoIcon = true;
    this.reportes.getDescargarTxtRfctabDispersar(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      this.cargandoIcon = false;
      this.reportes.crearArchivo(datos.datos,`archivoRFCs_${this.usuariosSistemaPrd.getIdEmpresa()}`,"txt");
    });
  }


  public filtrar(){
    
  }

}
