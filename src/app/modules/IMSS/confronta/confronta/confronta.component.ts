import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { SharedCompaniaService } from '../../../../shared/services/compania/shared-compania.service';
import { Router } from '@angular/router';

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
  public months=[0,1,2,3,4,5,6,7,8,9,10,11].map(x=>new Date(2021,x,1))
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
    public mes: any = '';
    public anio: any = '';
    public arregloCompanias: any = [];

  constructor(private routerPrd: Router, private empresasPrd: EmpresasService, private companiasPrd: SharedCompaniaService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService, private usuarioSistemaPrd: UsuarioSistemaService, private reportesPrd: ReportesService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();

    this.empresasPrd.getListarMovimientosIDSE().subscribe(datos => this.arregloMovimientos = datos.datos);
    this.empresasPrd.getListarRegistroPatronal(this.idEmpresa).subscribe(datos => this.arregloRegistroPatronal = datos.datos);
    this.companiasPrd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {



      this.arregloCompanias = datos.datos;

      if (this.usuarioSistemaPrd.getRol() == "ADMINEMPRESA") {

        this.arregloCompanias = [this.clonar(this.usuarioSistemaPrd.getDatosUsuario().centrocClienteId)]
      }
    });


    this.filtrar();

  }

    public traerTabla(datos:any) {
      const columna: Array<tabla> = [
        new tabla("regionPatronal", "Registro patronal"),
        new tabla("razonSocial", "Razón social"),
        new tabla("anio", "Año"),
        new tabla("mes", "Mes")
      ];
      
      this.arreglotabla = {
        columnas:[],
        filas:[]
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
   
        console.log('obj', this.objFiltro)
  
  this.empresasPrd.filtrarIDSE(this.objFiltro).subscribe(datos => {
    this.arreglo = datos.datos;

    this.traerTabla({ datos: this.arreglo });

    this.cargando = false;
  });

  }


  public verdetalle() {
    this.routerPrd.navigate(['imss', 'detalleconfronta', 'nuevo'], { state: { datos: undefined } });

  }
  public recibirTabla(obj: any) {

    switch (obj.type) {
        case "filaseleccionada":
          this.activarMultiseleccion = obj.datos;
        break;
    }

  }
  public clonar(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

}
