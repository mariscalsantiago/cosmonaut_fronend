import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from "moment";
import { tabla } from 'src/app/core/data/tabla';
import { Noticia } from 'src/app/core/modelos/noticia';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { usuarioClass, UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

  private usuario: usuarioClass | undefined = undefined;

  public cargando: Boolean = false;
  public tipoguardad: boolean = false;

  /*
    Directivas de filtros
  */
  public id_company: string = "";
  public idUsuario: any = "";
  public nombre: any = "";
  public apellidoPat: any = "";
  public apellidoMat: any = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;
  public arreglo : any = [];


  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  public esClienteEmpresa: boolean = false;

  public noticias: Noticia[] = [];
  public noticiasTabla: any = {
    columnas: [],
    filas: []
  };

  public modulo: string = "";
  public subModulo: string = "";

  public esRegistrar: boolean = false;
  public esConsultar: boolean = false;
  public esEditar: boolean = false;


  public cargandoBotones: boolean = false;
  public activarMultiseleccion: boolean = false;
  


  constructor(
    private routerPrd: Router,
    public configuracion: ConfiguracionesService,
    private companiPrd: SharedCompaniaService,
    private servicioModales: ModalService,
    private serviceUsuario: UsuarioSistemaService,
    private empresasProd: EmpresasService,
    private serviceNoticia: NoticiasService) { }

  ngOnInit(): void {


    this.modulo = this.configuracion.breadcrum.nombreModulo.toUpperCase();
    this.subModulo = this.configuracion.breadcrum.nombreSubmodulo.toUpperCase();

    this.usuario = this.serviceUsuario.getUsuario();

    this.establecerPermisos();

    this.esClienteEmpresa = this.routerPrd.url.includes("/noticias/cliente");

    this.cargandoBotones = true;

    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;

    this.cargando = true;

    if (this.esClienteEmpresa) {

      if (this.usuario?.esCliente && this.usuario?.centrocClienteIdPadre == 0) {

        this.serviceNoticia.getNoticiasCliente(this.usuario?.centrocClienteId).subscribe(
          (response) => {
            if (!!response.resultado && !!response.datos) {
              this.noticias = (response.datos as Noticia[]).sort((a, b) => moment(a.fechaFin).diff(moment(b.fechaFin)));
              this.procesarTabla();
            }

            this.cargando = false;
            this.cargandoBotones = false;
          }
        );
      } else {

        this.serviceNoticia.getNoticiasEmpresa(this.usuario?.centrocClienteId).subscribe(
          (response) => {
            if (!!response.resultado && !!response.datos) {
              this.noticias = (response.datos as Noticia[]).sort((a, b) => moment(a.fechaFin).diff(moment(b.fechaFin)));
              this.procesarTabla();
            }

            this.cargando = false;
            this.cargandoBotones = false;
          }
        );
      }
    } else {

      this.serviceNoticia.getNoticiasCosmonaut().subscribe(
        (response) => {
          if (!!response.resultado && !!response.datos) {
            this.noticias = (response.datos as Noticia[]).sort((a, b) => moment(a.fechaFin).diff(moment(b.fechaFin)));
            this.procesarTabla();
          }

          this.cargando = false;
          this.cargandoBotones = false;
        }
      );
    }
  }

  public establecerPermisos() {

    this.esRegistrar = this.configuracion.getPermisos("Registrar");
    this.esConsultar = this.configuracion.getPermisos("Consultar");
    this.esEditar = this.configuracion.getPermisos("Editar");
  }

  public inicio(){
    this.routerPrd.navigate(['/inicio']);
  }

  public procesarTabla() {
    
    this.arreglo = this.noticias;
    let columnas: Array<tabla> = [
      new tabla("titulo", "Título"),
      new tabla("subtitulo", "Subtítulo"),
      new tabla("fechaInicio", "Fecha inicio", false, false, true),
      new tabla("fechaFin", "Fecha fin", false, false, true),
      new tabla("__categoriaFormato", "Categoría", false, false, true),
    ];

    this.noticiasTabla = {
      columnas:[],
      filas:[]
    }

    if(this.arreglo !== undefined) {
      for(let item of this.arreglo) {
        item.fechaInicio = new DatePipe("es-MX").transform(new Date(item.fechaInicio), 'dd-MMM-y')?.replace(".","");
        item.fechaFin = new DatePipe("es-MX").transform(new Date(item.fechaFin), 'dd-MMM-y')?.replace(".","");
        item.__categoriaFormato = item.categoriaId.descripcion; 
      }
    }    

    this.noticiasTabla.columnas = columnas;
    this.noticiasTabla.filas = this.arreglo
    this.cargando = false;
  }

  public crearNoticia() {
    this.routerPrd.navigateByUrl(`noticias/detalle_noticia${this.esClienteEmpresa ? '/cliente' : ''}/nuevo`);
  }

  public mostrarDetalleNoticia(noticia: Noticia) {
    this.routerPrd.navigateByUrl(`noticias/detalle_noticia${this.esClienteEmpresa ? '/cliente' : ''}/editar`, { state: { noticia: noticia } });
  }

  public guardarMultiseleccion(tipoguardad: boolean) {

  }

  public filtrar() {

  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "editar":
        this.mostrarDetalleNoticia(obj.datos);
        break;
      case "eliminar":
        this.eliminarNoticia(obj.datos);
        break;
    }
  }


  public eliminarNoticia(noticia: Noticia) {

    //console.log("eliminarNoticia", noticia);
    let mensajeExtra = "Ningún empleado pordrá ver la noticia aunque no haya expirado la publicación"
    let titulo: string = "¿Está seguro que desea eliminar la noticia?";

    this.servicioModales.showMessageDialog(this.servicioModales.question, titulo, mensajeExtra).then(valor => {
      if (valor) { this.eliminiar(noticia); }
    });
  }

  private eliminiar(noticia: Noticia) {

    this.serviceNoticia.eliminarNoticia(noticia.noticiaId).subscribe(
      (response) => {
        if (!!response.resultado) {
          this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
          this.servicioModales.showMessageDialog(response.resultado, response.mensaje).then(() => {
            this.servicioModales.showMessageDialog(this.servicioModales.loadingfinish);
            this.quitarNoticia(noticia);
          });
        }
      }
    );
  }

  private quitarNoticia(noticia: Noticia) {
    this.noticias = this.noticias.filter(n => n.noticiaId != noticia.noticiaId);
    this.procesarTabla();
  }
}
