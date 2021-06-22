import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';

@Component({
  selector: 'app-variabilidad',
  templateUrl: './variabilidad.component.html',
  styleUrls: ['./variabilidad.component.scss']
})
export class VariabilidadComponent implements OnInit {

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
  public fromPromediar : boolean = false;
  public listaVariabilidad : boolean = true;

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


    public razonSocial: string = "";
    public nombre: string = "";
    public apellidoPat: string = "";
    public apellidoMat: string = "";
    public numeroEmpleado: string = "";
    public fechaMin: Date =  new Date('0000-00-00');
    public fechaMax: Date =  new Date('0000-00-00');
    public movimiento: number = 0;


  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private reportesPrd: ReportesService) { }

  ngOnInit(): void {
  //  debugger;
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();

    this.empresasPrd.getListarMovimientosIDSE().subscribe(datos => this.arregloMovimientos = datos.datos);
    this.empresasPrd.getListarRegistroPatronal(this.idEmpresa).subscribe(datos => this.arregloRegistroPatronal = datos.datos);


    this.filtrar();

  }

    public traerTabla(datos:any) {
      const columna: Array<tabla> = [
        new tabla("razonSocial", "Razón Social"),
        new tabla("anioFiscal", "Año"),
        new tabla("bimestre", "Bimestre"),
        new tabla("periodoCalculo", "Periodo de cálculo"),
        new tabla("fecha", "Fecha de amplicación"),
        new tabla("total_empleados", "Empleados"),
        new tabla("diasBimestre", "Días")
      ];
      
      this.arreglotabla = {
        columnas:[],
        filas:[]
      }
  
      if(this.arreglo !== undefined){
        for(let item of this.arreglo){
          if(item.fechaAplicacion !== undefined ){
          item.fechaAplicacion = (new Date(item.fechaAplicacion).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fecha = datepipe.transform(item.fechaAplicacion , 'dd-MMM-y')?.replace(".","");
  
          }
        }
      }
  
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = this.arreglo
    }


  public filtrar() {

   // debugger;

    this.cargando = true;

        this.objFiltro = {
          ...this.objFiltro,
          clienteId: 463,

        };
   
  //debugger;
  this.empresasPrd.filtrarVariabilidad(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }


  public guardarMultiseleccion(obj:any) {

    debugger;
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

  public promedioVariabilidad(){

    this.listaVariabilidad = false;
    this.fromPromediar = true;
  }

  public enviarPeticion(){

    
  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
        case "filaseleccionada":
          this.activarMultiseleccion = obj.datos;
        break;
    }

  }
}
