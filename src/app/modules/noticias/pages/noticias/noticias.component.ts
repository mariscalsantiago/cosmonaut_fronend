import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { Noticia } from 'src/app/core/modelos/noticia';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

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
  //public peticion: any = [];

  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  public esClienteEmpresa: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public esRegistrar: boolean = false;
  public esConsultar: boolean = false;
  public esEditar: boolean = false;


  public cargandoBotones: boolean = false;





  public activarMultiseleccion: boolean = false;


  constructor(private routerPrd: Router, public configuracion: ConfiguracionesService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private empresasProd: EmpresasService, private usuariosAuthPrd: UsuariosauthService) { }

  ngOnInit(): void {


    this.establecerPermisos();

    this.esClienteEmpresa = this.routerPrd.url.includes("/noticias/cliente");

    this.cargandoBotones = true;

    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;

    this.cargando = true;
    if (this.esClienteEmpresa) {
      this.cargandoBotones = false;
    } else {
      this.cargandoBotones = false;
    }

    this.cargando = false;
  }



  public establecerPermisos() {

    this.esRegistrar = true;//this.configuracion.getPermisos("Registrar");
    this.esConsultar = true;//this.configuracion.getPermisos("Consultar");
    this.esEditar = true;//this.configuracion.getPermisos("Editar");
  }

  public procesarTabla() {

    let columnas: Array<tabla> = [
      new tabla("usuarioId", "ID"),
      new tabla("nombre", "Nombre"),
      new tabla("apellidoPat", "Primer apellido"),
      new tabla("apellidoMat", "Segundo apellido"),
      new tabla("email", "Correo electrónico"),
      new tabla("rolnombre", "Rol"),
      ((this.esClienteEmpresa) ? new tabla("esMulticliente", "Multicliente") : new tabla("empresa", "empresa")),
      new tabla("activo", "Estatus ")
    ];

    columnas.splice(6, 1);

    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item["rolnombre"] = item?.rolId?.nombreRol;
        item["esMulticliente"] = item?.esMulticliente ? "Sí" : "No";
        if (item.esActivo) {
          item.activo = 'Activo'
        }
        if (!item.esActivo) {
          item.activo = 'Inactivo'
        }
      }
    }
    this.arreglotabla = {
      columnas: columnas,
      filas: this.arreglo
    }
  }





  public crearNoticia() {
    this.routerPrd.navigateByUrl(`noticias/detalle_noticia${this.esClienteEmpresa ? '/cliente' : ''}/nuevo`);
  }

  public mostrarDetalleNoticia(noticia: Noticia) {
    this.routerPrd.navigateByUrl(`noticias/detalle_noticia${this.esClienteEmpresa ? '/cliente' : ''}/editar`, { state: { noticia: noticia } });
  }







  public guardarMultiseleccion(tipoguardad: boolean) {


    this.tipoguardad = tipoguardad;
    let mensaje = `¿Deseas ${tipoguardad ? "activar" : "desactivar"} estos usuarios?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            arregloUsuario.push(item["usuarioId"]);

          }
        }

        let objEnviar = {
          ids: arregloUsuario,
          esActivo: tipoguardad
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.usuariosAuthPrd.usuariosActivarDesactivar(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(valor => {
            if (valor) {
              for (let item of arregloUsuario) {
                for (let item2 of this.arreglo) {
                  if (item2.usuarioId === item) {
                    item2["esActivo"] = tipoguardad;
                    item2["seleccionado"] = false;
                    break;
                  }
                }
              }

              this.activarMultiseleccion = false;

              this.cargando = true;
              if (this.esClienteEmpresa) {
                this.companiPrd.getAllCompany().subscribe(datos => {
                  this.arregloCompany = datos.datos
                  this.filtrar();
                });
              } else {
                if (this.usuariosSistemaPrd.esCliente()) {
                  this.empresasProd.getAllEmp(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {

                    if (Boolean(datos.datos)) {
                      this.arregloCompany = datos.datos;
                      this.arregloCompany.unshift({ centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa(), nombre: this.usuariosSistemaPrd.usuario.nombreEmpresa + "(" + "Cliente)", razonSocial: this.usuariosSistemaPrd.usuario.nombreEmpresa + "(" + "Cliente)" })
                    } else {
                      this.arregloCompany = datos.datos;
                    }
                    this.filtrar();

                  });
                } else {
                  this.empresasProd.getEmpresaById(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
                    this.arregloCompany = [datos.datos];
                    this.filtrar();

                  });
                }
              }
            }

          });
        });
      }
    });



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
      case "llave":
        this.generarllave(obj.datos);
        break;
    }

  }


  public generarllave(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas resetear y reenviar la clave de este usuario?").then((valor) => {
      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objenviar = {
          username: obj.email?.toLowerCase()
        }

        this.usuariosSistemaPrd.enviarCorreorecuperacion(objenviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        });

      }
    });
  }



}
