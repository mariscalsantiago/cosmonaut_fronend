import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ContenidoComponent } from 'src/app/layout/contenido/contenido/contenido.component';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ServerSentEventService } from 'src/app/shared/services/nominas/server-sent-event.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';

@Component({
  selector: 'app-generales',
  templateUrl: './generales.component.html',
  styleUrls: ['./generales.component.scss']
})

export class GeneralesComponent implements OnInit   {

  public arreglopintar: any = [false];
  public idEmpresa: number = -1;
  public valor: any;
  public eventos: any;
  public vistosRec: any = undefined;
  public apareceListadoEventos: boolean = false;
  public vistosTrue: boolean = false;
  public vistosFalse: boolean = false;
  public moduloId: boolean = false;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public cargando: boolean = false;
  public dataUrl: any = []; 
  public iframe: string = '';
  public datosIframe: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  public url!: SafeResourceUrl;

  constructor(
    private _sanitizer: DomSanitizer,
    private eventoPrd: EventosService,
    private catalogos: CatalogosService,
    private routerPrd: Router,
    private reportesPrd: ReportesService,
    private modalPrd: ModalService,
    private usuariosSistemaPrd: UsuarioSistemaService,
    public ContenidoComponent: ContenidoComponent,
    public configuracionPrd: ConfiguracionesService,
    private notificaciones:ServerSentEventService, 
    private rolesPrd: RolesService,
    private authUsuarioPrd: UsuariosauthService
    ) { }


  ngOnInit(): void {

    
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

        this.datosIframe = this.usuariosSistemaPrd.usuario;
        let centroCliente = this.datosIframe.centrocClienteId;
            
            let ruta1 = 'https://datastudio.google.com/embed/reporting/75a75df8-b651-48e3-907e-e441a03881d5/page/cG9hC?params=%7B%22ds0.centro_cliente%22%3A';
            let ruta2 = centroCliente+"%7D";
            this.iframe = ruta1+ruta2;
            this.cargando = true;
            this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.iframe);
  

  }




}
