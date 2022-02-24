import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { TablaValoresService } from '../../services/tablavalores.service';
import { DatePipe } from '@angular/common';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';



@Component({
  selector: 'app-listastablavalores',
  templateUrl: './listastablavalores.component.html',
  styleUrls: ['./listastablavalores.component.scss']
})
export class ListasTablaValoresComponent implements OnInit {


  public tamanio: number = 0;
  public cargando: boolean = false;
  public cargandoRef: boolean = false;
  public cargandoISR: boolean = false;
  public cargandoSubcidio: boolean = false;
  public cargandoNomina: boolean = false;
  public changeIconDown: boolean = false;
  public arregloRef: any = [];
  public arregloISR: any = [];
  public arregloSubsidio: any = [];
  public arregloNomina: any = [];
  public arreglopintar: any = [false, false, false, false];
  public aparecemodalito: boolean = false;
  public arreglodetalleISR: any = [];

  public arreglotablaRef: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaISR: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaSubcidio: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaNomina: any = {
    columnas: [],
    filas: []
  };

  public id_empresa: number = 0;
  public arreglo: any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;




  constructor(private routerPrd: Router, private activateRouter: ActivatedRoute,
    private tablavaloresProd:TablaValoresService, private ventana:VentanaemergenteService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.establecerPermisos();

    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];
      let fecha = new Date();
      let anio = fecha.getFullYear();
      this.cargandoRef = true;
      this.tablavaloresProd.getListaReferenciaCat(anio).subscribe(datos => {
          this.crearTablaReferencia(datos);
      });

      this.cargandoISR = true;
      this.tablavaloresProd.getListatablasPeriodicasISR().subscribe(datos => {
      this.crearTablaISR(datos);
      });

      this.cargandoSubcidio = true;
      this.tablavaloresProd.getListaTablasSubsidioISR().subscribe(datos => {
          this.crearTablaSubcidio(datos);
      });

      this.cargandoNomina = true;

      this.tablavaloresProd.getListaEstadosISN().subscribe(datos => {
          this.crearTablaISN(datos);
      });

    });

  }



 public establecerPermisos(){
  this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
  this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
  this.esEditar = this.configuracionesPrd.getPermisos("Editar");
  this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
}




  public crearTablaReferencia(datos:any){


    this.arregloRef = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("tipovalor", "Tipo de valor"),
      new tabla("valor", "Valor"),
      new tabla("fechaFin", "Vigencia")
    ];


    this.arreglotablaRef = {
      columnas: [],
      filas: []
    };


    if(this.arregloRef !== undefined){
      for(let item of this.arregloRef){
        item.fechaFin = (new Date(item.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaFin = datepipe.transform(item.fechaFin , 'dd-MMM-y')?.replace(".","");
        item.valor = this.formatearNumero(item.valor);
        item.tipovalor = item.tipoValorReferenciaId?.descripcion;
      }
    }

    this.arreglotablaRef.columnas = columnas;
    this.arreglotablaRef.filas = this.arregloRef;
    this.cargandoRef = false;

  }

  public formatearNumero(valor: number){
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
    return formatter.format(valor);
  }

  public crearTablaISR(datos:any){


    this.arregloISR = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("tabla", "Tipo tabla")
    ];

    this.arreglotablaISR = {
      columnas: [],
      filas: []
    };


    this.arreglotablaISR.columnas = columnas;
    this.arreglotablaISR.filas = this.arregloISR;
    this.cargandoISR = false;

  }

  public crearTablaSubcidio(datos:any){


    this.arregloSubsidio = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("tabla", "Tipo tabla")

    ];

    this.arreglotablaSubcidio = {
      columnas: [],
      filas: []
    };

    this.arreglotablaSubcidio.columnas = columnas;
    this.arreglotablaSubcidio.filas = this.arregloSubsidio;
    this.cargandoSubcidio = false;

  }
  public crearTablaISN(datos:any){


    this.arregloNomina = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("estado", "Tipo tabla")

    ];

    this.arreglotablaNomina = {
      columnas: [],
      filas: []
    };


    this.arreglotablaNomina.columnas = columnas;
    this.arreglotablaNomina.filas = this.arregloNomina;
    this.cargandoNomina = false;

  }


  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

    public recibirTablaISR(obj:any){

    let datosDed = obj.datos;
    this.ventana.showVentana(this.ventana.tablaisr,{datos:datosDed}).then(valor =>{
    });
  }

  public recibirTablaSubcidio(obj:any){

    let datosDed = obj.datos;
    this.ventana.showVentana(this.ventana.subcidio,{datos:datosDed}).then(valor =>{
    });
  }

  public recibirTablaISN(obj:any){

    let datos = obj.datos;
    this.ventana.showVentana(this.ventana.tablaisn,{datos:datos}).then(valor =>{
    });
  }



}
