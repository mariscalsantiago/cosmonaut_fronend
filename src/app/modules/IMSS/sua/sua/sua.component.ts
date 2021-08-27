import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-sua',
  templateUrl: './sua.component.html',
  styleUrls: ['./sua.component.scss']
})
export class SuaComponent implements OnInit {

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
    public idregistroPatronal: number = 0;
    public nombre: string = "";
    public apellidoPat: string = "";
    public apellidoMat: string = "";
    public numeroEmpleado: string = "";
    public fechaMin: Date =  new Date('0000-00-00');
    public fechaMax: Date =  new Date('0000-00-00');
    public movimiento: number = 0;


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
        new tabla("nombre", "Nombre completo del empleado"),
        new tabla("sbcDecimal", "SBC"),
        new tabla("movimiento", "Movimiento"),
        new tabla("fechamovimiento", "Fecha de movimiento")
      ];
      
      this.arreglotabla = {
        columnas:[],
        filas:[]
      }
  
      if(this.arreglo !== undefined){
        for(let item of this.arreglo){
          if(item.fecha_movimiento !== undefined ){
          item.fechamovimiento = new DatePipe("es-MX").transform(new Date(new Date(item.fecha_movimiento).toUTCString().replace("GMT","")), 'dd-MMM-y');
          item.nombre = item.nombre + " " + item.apellidoPat+" "+(item.apellidoMat == undefined ? "":item.apellidoMat);
          item.sbcDecimal = item.sbc.toFixed(2); 
 
          }
        }
      }
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
    }


  public filtrar() {
    this.cargando = true;
    this.objFiltro = [];
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

    if(this.nombre != ''){
      this.objFiltro = {
        ...this.objFiltro,
        nombre: this.nombre
      };
      }
      if(this.apellidoPat != ''){
        this.objFiltro = {
          ...this.objFiltro,
          apellidoPat: this.apellidoPat
        };
        }
        if(this.apellidoMat != ''){
          this.objFiltro = {
            ...this.objFiltro,
            apellidoMat: this.apellidoMat
          };
        }
        if(this.numeroEmpleado != ''){
          this.objFiltro = {
            ...this.objFiltro,
            numeroEmpleado: this.numeroEmpleado
          };
        }
        if(this.movimiento != 0){
          this.objFiltro = {
            ...this.objFiltro,
            movimiento: this.movimiento
          };
        }
        this.objFiltro = {
          ...this.objFiltro,
          clienteId: this.idEmpresa,
          fechaMax: this.fechaMax,
          fechaMin: this.fechaMin
        };
        this.fechaMax = new Date('0000-00-00');
        this.fechaMin = new Date('0000-00-00');
  
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
