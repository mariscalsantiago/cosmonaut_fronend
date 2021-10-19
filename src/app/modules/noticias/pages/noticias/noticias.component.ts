import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { Noticia } from 'src/app/core/modelos/noticia';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

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



  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  public esClienteEmpresa: boolean = false;

  public noticias: Noticia[] = [];
  public noticiasTabla: any = {
    columnas: [],
    filas: []
  };


  public esRegistrar: boolean = false;
  public esConsultar: boolean = false;
  public esEditar: boolean = false;


  public cargandoBotones: boolean = false;
  public activarMultiseleccion: boolean = false;


  constructor(
    private routerPrd: Router,
    public configuracion: ConfiguracionesService,
    private companiPrd: SharedCompaniaService,
    private modalPrd: ModalService,
    private usuariosSistemaPrd: UsuarioSistemaService,
    private empresasProd: EmpresasService,
    private usuariosAuthPrd: UsuariosauthService,
    private serviceNoticia: NoticiasService) { }

  ngOnInit(): void {

    this.establecerPermisos();

    this.esClienteEmpresa = this.routerPrd.url.includes("/noticias/cliente");

    this.cargandoBotones = true;

    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.serviceNoticia.getNoticiasEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(
      (response) => {
        if (!!response.resultado && !!response.datos) {
          this.noticias = response.datos.noticiasGeneral;
          this.procesarTabla();
        }
        this.cargando = false;
        this.cargandoBotones = false;
      }
    );
  }

  public establecerPermisos() {

    this.esRegistrar = this.configuracion.getPermisos("Registrar");
    this.esConsultar = this.configuracion.getPermisos("Consultar");
    this.esEditar = this.configuracion.getPermisos("Editar");
  }

  public procesarTabla() {

    let columnas: Array<tabla> = [
      new tabla("titulo", "Título"),
      new tabla("subtitulo", "Subtítulo"),
      new tabla("fechaInicioFormato", "Fecha inicio", false, false, true),
      new tabla("fechaFinFormato", "Fecha fin", false, false, true),
      new tabla("categoriaFormato", "Categoría", false, false, true),
    ];

    let datePipe = new DatePipe("en-MX");
    this.noticias.forEach(noticia => {
      noticia["fechaInicioFormato"] = datePipe.transform(new Date(noticia.fechaInicio), 'dd/MM/yyyy') as string;
      noticia["fechaFinFormato"] = datePipe.transform(new Date(noticia.fechaFin), 'dd/MM/yyyy') as string;
      noticia["categoriaFormato"] = noticia.categoriaId.descripcion as string;
    });

    this.noticiasTabla = {
      columnas: columnas,
      filas: this.noticias
    }
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
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;
      case "eliminar":
        console.log("dasjdaskdhajks");
        break;
    }
  }

}
