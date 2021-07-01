import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-confronta',
  templateUrl: './confronta.component.html',
  styleUrls: ['./confronta.component.scss']
})
export class ConfrontaComponent implements OnInit {

  public empresa: any;
  public idEmpresa: number = 0;
  public arregloMovimientos: any = [];
  public arregloRegistroPatronal: any = [];
  public arreglo: any = [];
  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public objFiltro: any = [];
  public activarMultiseleccion: boolean = false;
  public arregloSUA : any = [];
  public movimientoImssId : number = 0;
  public mensaje : string = "";

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }
  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };

      /*
    Directivas de filtros
  */


    public registroPatronal: string = "";
    public idregistroPatronal: any = 0;
    public razonSocial: string = "";
    public mes: Date =  new Date('00');
    public anio: Date =  new Date('0000');


  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private reportesPrd: ReportesService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();

    this.empresasPrd.getListarMovimientosIDSE().subscribe(datos => this.arregloMovimientos = datos.datos);
    this.empresasPrd.getListarRegistroPatronal(this.idEmpresa).subscribe(datos => this.arregloRegistroPatronal = datos.datos);


    this.filtrar();

  }

    public traerTabla(datos:any) {
      const columna: Array<tabla> = [
        new tabla("regionPatronal", "Región patronal"),
        new tabla("razonSocial", "Razón social"),
        new tabla("anio", "Año"),
        new tabla("mes", "Mes"),
        new tabla("download", "Acciones")
      ];
      
      this.arreglotabla = {
        columnas:[],
        filas:[]
      }
  
      if(this.arreglo !== undefined){
        for(let item of this.arreglo){
          if(item.fecha_movimiento !== undefined ){
          item.fecha_movimiento = (new Date(item.fecha_movimiento).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fechamovimiento = datepipe.transform(item.fecha_movimiento , 'dd-MMM-y')?.replace(".","");
  
          item.nombre = item.nombre + " " + item.apellidoPat+" "+(item.apellidoMat == undefined ? "":item.apellidoMat);
 
          }
        }
      }
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
    }


  public filtrar() {
    this.cargando = true;

    for(let item of this.arregloRegistroPatronal){
      if(item.registroPatronalId = this.idregistroPatronal)
      this.registroPatronal = item.registroPatronal;
    }
    if(this.registroPatronal != ''){
    this.objFiltro = {
      ...this.objFiltro,
      registroPatronal: this.registroPatronal
    };
    }

    if(this.anio != undefined){
      this.objFiltro = {
        ...this.objFiltro,
        anio: this.anio
      };
      }
      if(this.mes != undefined){
        this.objFiltro = {
          ...this.objFiltro,
          mes: this.mes
        };
        }

        this.objFiltro = {
          ...this.objFiltro,
          clienteId: this.idEmpresa,
        };
   
  
  this.empresasPrd.filtrarIDSE(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }


  public guardarMultiseleccion(obj:any) {

    
    if(obj == 1){
      this.mensaje = `¿Deseas descargar el archivo de altas?`;
    }
    else if(obj == 2){
      this.mensaje = `¿Deseas descargar el archivo de modificaciones?`;
      }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, this.mensaje).then(valor => {
      if (valor) {

        let valorAltas = [];
        let valorModif = [];
        for (let item of this.arreglo) {

          if (item["seleccionado"]) {
            if(obj==1){

              if(item.movimientoImssId ==3){
                valorAltas.push(item.kardex_colaborador_id);
              }
            }
            else if(obj==2){
              if(item.movimientoImssId ==1 || item.movimientoImssId ==2){
                valorModif.push(item.kardex_colaborador_id);
              }
            }

          }
        }
        if(obj==1){
          this.arregloSUA = { 
            idEmpresa: this.idEmpresa,
            idKardex: valorAltas
          }
        }

        if(obj==2){
          this.arregloSUA = { 
            idEmpresa: this.idEmpresa,
            idKardex: valorModif
          }
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        if(obj == 1){
        this.reportesPrd.getDescargaLayaoutAltasSUA(this.arregloSUA).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout reingresos/altas SUA"}.txt`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloSUA.idKardex) {
              for (let item2 of this.arreglo) {
                if (item2.kardex_colaborador_id === item) {
                  item2["seleccionado"] = false;
                  break;
                }
              }
            }
            this.activarMultiseleccion = false;
          }
        });
      }
      if(obj == 2){
        this.reportesPrd.getDescargaLayaoutMoficacionSUA(this.arregloSUA).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/txt;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout modificacion SUA"}.txt`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloSUA.idKardex) {
              for (let item2 of this.arreglo) {
                if (item2.kardex_colaborador_id === item) {
                  item2["seleccionado"] = false;
                  break;
                }
              }
            }
            this.activarMultiseleccion = false;
          }
        });
      }

      }
    });
    



  }
  public recibirTabla(obj: any) {

    switch (obj.type) {
        case "filaseleccionada":
          this.activarMultiseleccion = obj.datos;
        break;
    }

  }
}
