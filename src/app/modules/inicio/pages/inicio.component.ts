import { Component, OnInit } from '@angular/core';
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
import { Noticia } from './../../../core/modelos/noticia';
import { NoticiasService } from './../../noticias/services/noticias.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';
import { EmpleadosService } from '../../empleados/services/empleados.service';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})

export class InicioComponent implements OnInit   {

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
  public eventosCopia: any;


  public arreglo: any = [];
  public vistosRecientesFinal: any = [];
  public arreglosIdSubmodulo: any = [];
  public contratoDesc: string | undefined;
  public dataUrl: any = [];
  public iframe: string = '';
  public datosIframe: any = [];
  public objFiltro: any = [];
  public countBaja: number = 0;
  public countExt: number = 0;
  public proxVencer: number = 0;

  public countExtSal: number = 0;
  public proxVencerSal: number = 0;

  public countExtAlt: number = 0;
  public proxVencerAlt: number = 0;

  public movbaja: string = '';
  public modsalario: string = '';
  public altarein: string = '';

  noticiasAdministrador: Noticia[] = [];
  noticiasEmpresa: Noticia[] = [];
  noticiasListado: Noticia[] = [];
  noticiasCursos: Noticia[] = [];

  public url!: SafeResourceUrl;

  constructor(
    private _sanitizer: DomSanitizer,
    private eventoPrd: EventosService,
    private catalogos: CatalogosService,
    private routerPrd: Router,
    private reportesPrd: ReportesService,
    private modalPrd: ModalService,
    private serviceNoticia: NoticiasService,
    private usuariosSistemaPrd: UsuarioSistemaService,
    public ContenidoComponent: ContenidoComponent,
    public configuracionPrd: ConfiguracionesService,
    private notificaciones:ServerSentEventService,
    private rolesPrd: RolesService,
    private authUsuarioPrd: UsuariosauthService,
    private empleadosPrd:EmpleadosService,
    private empresasPrd: EmpresasService
    ) { }


  ngOnInit(): void {

    this.idEmpresa = this.usuariosSistemaPrd.getIdEmpresa();

    this.authUsuarioPrd.getVersionByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      if(datos.datos !== undefined){
        let objVersion = datos.datos.versionCosmonautId;
        if(datos.datos.versionCosmonautId?.versionCosmonautId === 1){
          this.moduloId = true;
        }
    /*         else if(datos.datos.versionCosmonautId?.versionCosmonautId === 4){
            this.moduloId = true;
          } */
        this.datosIframe = this.usuariosSistemaPrd.usuario;

        this.rolesPrd.getIframe(this.datosIframe.usuarioId,this.datosIframe.centrocClienteId,objVersion.versionCosmonautId).subscribe(datos => {
          if(datos.datos !== undefined){
            this.iframe = datos.datos;
            //'https://datastudio.google.com/embed/reporting/d60a5a01-b359-4963-82af-e67370d81203/page/odxgC';
            this.cargando = true;
            this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.iframe);
          }
        });
      }

    });

    this.objFiltro = {
      clienteId: this.idEmpresa,
    };


    this.empresasPrd.filtrarIDSE(this.objFiltro).subscribe(datos => {
      if(datos.datos !== undefined){

        for(let item of datos.datos){
          if(item.movimientoImssId == 1){
            this.movbaja = item.movimiento;
            if(item.vigencia_movimiento === 'Extemporáneo'){
              this.countExt = this.countExt + 1;
            }
            if(item.vigencia_movimiento === 'Próximo a vencer'){
              this.proxVencer = this.proxVencer + 1;
            }
          }

          if(item.movimientoImssId == 2){
            this.modsalario = item.movimiento;
            if(item.vigencia_movimiento === 'Extemporáneo'){
              this.countExtSal = this.countExtSal + 1;
            }
            if(item.vigencia_movimiento === 'Próximo a vencer'){
              this.proxVencerSal = this.proxVencerSal + 1;
            }
          }

          if(item.movimientoImssId == 3){
            this.altarein = item.movimiento;
            if(item.vigencia_movimiento === 'Extemporáneo'){
              this.countExtAlt = this.countExtAlt + 1;
            }
            if(item.vigencia_movimiento === 'Próximo a vencer'){
              this.proxVencerAlt = this.proxVencerAlt + 1;
            }
          }

        }
      }


    });


    if (this.puedeConsultarKiosko()) {
      this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        if (!datos.resultado) {
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        } else {
          let idPersona = datos.datos.personaId;
          this.serviceNoticia.getNoticiasEmpleado(this.idEmpresa,this.usuariosSistemaPrd.usuario.centrocClienteIdPadre,idPersona).subscribe(

            (response) => {

              //console.log(response);
              if (!!response.resultado) {

                if (!!response.datos.noticiasCosmonaut) {
                  (response.datos.noticiasCosmonaut as Noticia[]).sort((a, b) => moment(a.fechaFin).diff(moment(b.fechaFin))).forEach(noticia => {
                    this.noticiasAdministrador.push(noticia);
                  });
                }

                if (!!response.datos.noticiasGeneral) {
                  (response.datos.noticiasGeneral as Noticia[]).sort((a, b) => moment(a.fechaFin).diff(moment(b.fechaFin))).forEach(noticia => {

                    switch (noticia.categoriaId.categoriaNoticiaId) {
                      case 1:
                        this.noticiasEmpresa.push(noticia);
                        break;
                      case 2:
                      case 3:
                      case 4:
                        this.noticiasListado.push(noticia);
                        break;
                      case 5:
                      case 6:
                        this.noticiasCursos.push(noticia);
                        break;
                      default:
                        break;
                    }
                  });
                }
              }
            }
          );
        }
      });

    }

    if (this.configuracionPrd.VISTOS_RECIENTE.length != 0) {
      this.vistosTrue = true;
      this.vistosFalse = false;
      this.vistosRec = this.configuracionPrd.VISTOS_RECIENTE;

      for (let item of this.vistosRec) {

        if (this.arreglosIdSubmodulo.length != 0 && this.arreglosIdSubmodulo.length <= 5) {
          this.contratoDesc = this.arreglosIdSubmodulo.find((itemvisto: any) => itemvisto.submoduloId === item.submoduloId)?.nombreSubmodulo;
          if (this.contratoDesc !== undefined)
            continue;
          this.arreglosIdSubmodulo.push(item);


        } else {
          this.arreglosIdSubmodulo.push(item);
        }
      }
    } else {
      this.vistosFalse = true;
      this.vistosTrue = false;
      this.vistosRec = {
        ...this.vistosRec,
        icono: "icon_home",
        nombreModulo: "Inicio"
      }

      this.arreglosIdSubmodulo.push(this.vistosRec);
    }
  }

  puedeConsultarKiosko(): boolean {
    return this.usuariosSistemaPrd.getUsuario().rolId == 2;
  }

  puedeConsultarCalendario(): boolean {
    return this.usuariosSistemaPrd.getUsuario().rolId != 2;
  }

  mostrarContenido(noticia: Noticia) {

    this.configuracionPrd.accesoRuta = true;
    this.routerPrd.navigate(['noticias', 'contenido_noticia', noticia.noticiaId], { state: { noticia: noticia } });

    setTimeout(() => {
      if (!this.configuracionPrd.cargandomodulo) {
        setTimeout(() => {
          this.configuracionPrd.accesoRuta = false;
        }, 10);
      }
    }, 10);
  }

  public iniciarDescarga() {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.reportesPrd.getDescargaListaEmpleados(this.idEmpresa).subscribe(archivo => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
      const downloadLink = document.createElement("a");
      const fileName = `${"Empleados"}.xlsx`;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });

  }

  public calcularFechasEventos(fechaActual: Date) {



    let inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    let finalMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    let obj = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      fechaInicio: inicioMes.getTime(),
      fechaFin: finalMes.getTime(),
      esActivo: true
    }

    this.eventoPrd.filtro(obj).subscribe(datos => {


      this.arreglo = datos.datos;

      if (this.arreglo !== undefined) {
        let temporal = JSON.stringify(this.arreglo);

      } else {
        this.arreglotabla.filas = this.arreglotabla;
      }


      this.cargando = false;


      this.eventos = datos.datos;
      this.eventosCopia = datos.datos;

      // this.filtrandoEventos();
    });
  }




  public verdetalle(obj: any) {

    this.configuracionPrd.accesoRuta = true;
    this.routerPrd.navigate(['/eventos/eventosxempleado']);

    setTimeout(() => {
      if (!this.configuracionPrd.cargandomodulo) {
        setTimeout(() => {
          this.configuracionPrd.accesoRuta = false;
        }, 10);
      }

    }, 10);

  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "fecha":
        this.calcularFechasEventos(obj.datos);
        break;
    }

  }

  public enbase() {

    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "block"

    let base64:string = "UEsDBBQACAgIABQGYlMAAAAAAAAAAAAAAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbLVTy27CMBD8lcjXKjb0UFUVgUMfxxap9ANce5NY+CWvofD3XQc4lFKJCnHyY2ZnZlf2ZLZxtlpDQhN8w8Z8xCrwKmjju4Z9LF7qe1Zhll5LGzw0zAc2m04W2whYUanHhvU5xwchUPXgJPIQwRPShuRkpmPqRJRqKTsQt6PRnVDBZ/C5zkWDTSdP0MqVzdXj7r5IN0zGaI2SmVKJtddHovVekCewAwd7E/GGCKx63pDKrhtCkYkzHI4Ly5nq3mguyWj4V7TQtkaBDmrlqIRDUdWg65iImLKBfc65TPlVOhIURJ4TioKk+SXeh7GokOAsw0K8yPGoW4wJpMYeIDvLsZcJ9HtO9Jh+h9hY8YNwxRx5a09MoQQYkGtOgFbupPGn3L9CWn6GsLyef3EY9n/ZDyCKYRkfcojhe0+/AVBLBwh6lMpxOwEAABwEAABQSwMEFAAICAgAFAZiUwAAAAAAAAAAAAAAAAsAAABfcmVscy8ucmVsc62SwWrDMAyGX8Xo3jjtYIxRt5cy6G2M7gE0W0lMYsvY2pa9/cwuW0sKG+woJH3/B9J2P4dJvVEunqOBddOComjZ+dgbeD49rO5AFcHocOJIBiLDfrd9ogmlbpTBp6IqIhYDg0i617rYgQKWhhPF2uk4B5Ra5l4ntCP2pDdte6vzTwacM9XRGchHtwZ1wtyTGJgn/c55fGEem4qtjY9EvwnlrvOWDmxfA0VZyL6YAL3ssvl2cWwfM9dNTOm/ZWgWio7cKtUEyuKpXDO6WTCynOlvStePogMJOhT8ol4I6bMf2H0CUEsHCKeMer3jAAAASQIAAFBLAwQUAAgICAAUBmJTAAAAAAAAAAAAAAAAEAAAAGRvY1Byb3BzL2FwcC54bWxNjsEKwjAQRO9+Rci93epBRNKUggie7EE/IKTbNtBsQrJKP9+c1OPMMI+nus2v4o0pu0Ct3NeNFEg2jI7mVj4f1+okO71TQwoREzvMohwot3JhjmeAbBf0JtdlprJMIXnDJaYZwjQ5i5dgXx6J4dA0R8CNkUYcq/gFSq36GFdnDRcH3UdTkGK43xT89wp+DvoDUEsHCOF8d9iRAAAAtwAAAFBLAwQUAAgICAAUBmJTAAAAAAAAAAAAAAAAEQAAAGRvY1Byb3BzL2NvcmUueG1sbZDbSsQwFEV/JeS9TdLKKKHtIMqAoDhgxcG3kBzbYnMhiXb8e9M6VlDfkux1Fie72h71iN7Bh8GaGrOcYgRGWjWYrsaP7S67wChEYZQYrYEaG4u3TSUdl9bD3lsHPg4QUNKYwKWrcR+j44QE2YMWIU+ESeGL9VrEdPUdcUK+ig5IQemGaIhCiSjILMzcasQnpZKr0r35cREoSWAEDSYGwnJGftgIXod/B5ZkJY9hWKlpmvKpXLi0ESOHu9uHZflsMPPXJeCmOqm59CAiKJQEPH641Mh38lReXbc73BS0YBljGS1aSvnZOS83zxX5NT8Lv87WN5epkB7Q/v5m5tbnivypufkEUEsHCOuaDk0FAQAAsAEAAFBLAwQUAAgICAAUBmJTAAAAAAAAAAAAAAAAFAAAAHhsL3NoYXJlZFN0cmluZ3MueG1slVVNT9wwEL33V4xyJ9/JJqtl0VKK1AoQKvQHeJNhceXYW9tBhf/UU29c+WOdzdKqzWSReovfPI/fjN84i5PvnYIHtE4afRwkYRwA6sa0Um+Ogy+350dVcLJ8t3DOQ2N67YkTE6fX8luP7/dImQZAabQ7Du69386jyDX32AkXmi1qitwZ2wlPS7uJ3NaiaN09ou9UlMZxGXVC6mC5cHK58Msr060tQougBGBHbCdgDqfmES6Mbo2GdBH55SLa0fdbPuPWWD/s2VrTYSvN7vtBWCnWCt2Yf4325YdpzRxyb+BUduj8/sg0TpMx++rluUM7ZCQ5isQbRvmtWR2k3PSoWgNr29ORHWrXC3WA00oSzhKci8YbC1J73FjRyJefekw5k8LB+rWcyaASa2NJ3WHaR72hjhPhre41uG3IL/gG60aoXRWwFm7obGO8fNrLBkE1UMz+157GT3TsTN6hJb9KMY4kZVGNsQvRWwHXRjcIwzfbFNd1HVbxGM/KMixLxg7jvGBmLBmSsJ1xGPMzqixM80k0G6NHlID5NMnzmhlTPKJSElZruRFSwSXqFp9gBLNMRRxPSSwmUWpDEc/GaM6QIk3DkudMizArxmgazhhG9bEbvRTWSw0rhV+FbmlIT4W1SBM2DrBk1XSJ5TSazsKE32tRsyIvhaYhhtWDpNdrvxhT6p3Han7/WRZm7KZ3HuPOy/IqrFiDBnTKa1NWYco/GRq6i146OEerxeCTPxhrSD45J2lyaE5mzJop9TTmF79D2RSQXpaVtPUIq01PnbYwrKYOrllLy7QOCyZnQMf+iv6h3Bov1O5d+vD6xrs5/CUron/k8hdQSwcIRGH5eHUCAABQBwAAUEsDBBQACAgIABQGYlMAAAAAAAAAAAAAAAANAAAAeGwvc3R5bGVzLnhtbO1Yy27bMBC89ysI3hv5XbeQFKBJXfQcF8iVliiZCB8CSadyvr5LUrIMp0bdnMrAF5Mc7swOKHNXdnrbCo6eqTZMyQyPb0YYUVmoksk6wz/Xq49LfJt/SI3dc/qwpdQiIEiT4a21zZckMcWWCmJuVEMl7FRKC2JhqevENJqS0jiS4MlkNFokgjCJ81TuxEpYgwq1kzbDI5zkaaXkgIynOCB5al7QM+EAOW8QVyiuNGKypC0tM7x0mCSChqg7wtlGMy9IBOP7AE8c4K12cYJJpR2YhCzh8486pwY2YWn1jl4FrgLvT8APBoQY54cbOcMByNOGWEu1XMECdfP1vqEZlkp2Mj7uL9El0U/fNdlfzvD6EFXf+RKg6w1c7Pn9t/uZ1zjiXapoFGflP0r6AU5no3QJZbM/nznuoTzltLJA16zeutGqxp21slYJmJSM1EoS7hL0jGF0QX2RO7XT776iQYZzHL/1dlnkCz/US1qyncD/TZYLGa+SdhN4fgXl/MGJPFZD2wGhtkKhPf0oXWdC7jL0U3jy3TTIhIVLdKwWtI9kJ4s36aK2OiQ4xx4P7OkZNiJNw/fuO9zd9A5QzpoH8hRKRC0FlRZtlWYvsOXqQgEA1Rj90qRZ09YOlaLRytLCwjsD4qp4co34UETa6rzdSVx2p3HZncVldx6X3UVcdj/FZXcZl93PcdkdjyLzG1lfG0fW2M69dMxO7X71W4PqVfAqeBV8H4JJ9zMFZsPfe/lvUEsHCBG2UH4wAgAAEhQAAFBLAwQUAAgICAAUBmJTAAAAAAAAAAAAAAAADwAAAHhsL3dvcmtib29rLnhtbI2OMU/DMBCFd36FdTt1AghBFKcLQurWoXS/xJfGqu2Lzqbl55OkCjAynZ7ep+9evf0KXl1IkuNooNwUoCh2bF08Gfg4vN+/wLa5q68s55b5rCY8JgNDzmOldeoGCpg2PFKcmp4lYJ6inHQahdCmgSgHrx+K4lkHdBFuhkr+4+C+dx29cfcZKOabRMhjnsamwY0Jmp9le1EWM5WvxZOBHn0i0E09N0dH1/QLzlFhl92FDtgaKGZO/wGXzetVEQMZ2AsHso6VJXVEcdh6SqCkctaA7OwjqAXfTbFchKtFr3+bb1BLBwi3VwJE4QAAAGwBAABQSwMEFAAICAgAFAZiUwAAAAAAAAAAAAAAABoAAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc62RTWvDMAxA/4rRfXHSwRijbi9j0OvW/QBjK3FoIhlL++i/n7vD1kAHO/QkjPB7D7Tefs6TecciI5ODrmnBIAWOIw0OXvdPN/dgRD1FPzGhA2LYbtbPOHmtPySNWUxFkDhIqvnBWgkJZy8NZ6S66bnMXuuzDDb7cPAD2lXb3tlyzoAl0+yig7KLHZi9LwOqA0m+YHzRUsukqeC6Omb8j5b7fgz4yOFtRtILdruAg70cszqL0eOE16/4pv6lv/3Vf3A5SELUU3kd3bVLfgSnGLu49uYLUEsHCIYDO5HUAAAAMwIAAFBLAwQUAAgICAAUBmJTAAAAAAAAAAAAAAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbJWYXXOiSBiF7/dXUNxv+JKvlDo1iiZRt2prZ3b3mmir1AhY0Inz87dpCNPnlXQtF0aa85ymObxpu5l++ZlfjHdW1VlZzEznwTYNVuzLQ1acZubf39e/R+aX+W/TW1n9qM+McUPwRT0zz5xfHy2r3p9ZntYP5ZUVQjmWVZ5y0axOVn2tWHqQpvxiubYdWHmaFeZ8eshyVjQXNCp2nJlfnced45rWfCrhfzJ2q5Vjo7n2a1n+aBovh5kphsjT12/swvaciTav3ljjtu7sazmcPyvjwI7p24X/Vd6eWXY6c3GnvrhVYdqXl1r+NfKsCcA08vSn/L5lB36emZ7z4PqmsX+reZn/2577uGJvczubO87mdTZvnG3S2SbjbH5n88fZgs4WjLOFnS0cZ4s6WzTOFne2eJzNsT+etz3S2BfKyEpxPkrF+X+1YrUFKss5SXk6n1blzaiaChW9NgdfxQhEQdei/T63p9Z7YxIfwfWw28OuAjvDsNfDngK7w7Dfw34HG3U7uPe511sksVAJVxITJJYq4UnCRyJRiYkkAiRWKuFLIkRirRKBJCIknlQilESMxLNKRG2aNiIvKhK3iIPIBjKzW8ZFZgtMG6xDkt0B00brTIYfWNA/sEAtBZLzAkQS8RJEkm4CIgl2BSLJdK2KLknzCUSS4zOIJMAXnbgBkcS6BZHU6g5EfzjssA87VGmS5wJEkucSRJJnAiLJc6WKHslzHerCBicNO9SFrRM30C2tcxBpgYP4SWVHfdiRStPKBpFWNoi0skGklR3pKjvShR3pwo50YevEDXRLBrTVibtPuoWw4z7sWKEn5N4WIJJ7W4JIhp+ASMphBSL5x1zHurBBpGHHurB14gYGRCpuCyKpuB2I4XDY8qeh+7G3VZ4U4QJV8lyXoPokmQRVEs0KVXL7a1DvMgf1rsLRS1PXqhscFZ2+UaXzN/b8yQTuKMssdZ3l01kFVTqtgHo3r6BKJxbsma5lQL1P3tEm72iT16kbHFVEkweVzi/Y82fJ/1qzOh+LVrm8adeFAZ1pEGoXfgGdcRAKBntKEAoHoRVC0SC0RigehJ4Acu1B6BkhZxB6QcgdhDYIDYe5RWgyCO0Q8inUPk1L2bnkrDqxJbtcamNfvhW8XeP3Z/u3AYnT7HzoefcxcYfOe4+JJ3dKv7qfT6/pif2RVqesqI3Xkot91cy0H0KxTj6WJWdV0xK7mzNLD33jwo5cUqZRtS8J5DEvr523uUj/ImT+H1BLBwi7MEr2qAMAADsRAABQSwECFAAUAAgICAAUBmJTepTKcTsBAAAcBAAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQIUABQACAgIABQGYlOnjHq94wAAAEkCAAALAAAAAAAAAAAAAAAAAHwBAABfcmVscy8ucmVsc1BLAQIUABQACAgIABQGYlPhfHfYkQAAALcAAAAQAAAAAAAAAAAAAAAAAJgCAABkb2NQcm9wcy9hcHAueG1sUEsBAhQAFAAICAgAFAZiU+uaDk0FAQAAsAEAABEAAAAAAAAAAAAAAAAAZwMAAGRvY1Byb3BzL2NvcmUueG1sUEsBAhQAFAAICAgAFAZiU0Rh+Xh1AgAAUAcAABQAAAAAAAAAAAAAAAAAqwQAAHhsL3NoYXJlZFN0cmluZ3MueG1sUEsBAhQAFAAICAgAFAZiUxG2UH4wAgAAEhQAAA0AAAAAAAAAAAAAAAAAYgcAAHhsL3N0eWxlcy54bWxQSwECFAAUAAgICAAUBmJTt1cCROEAAABsAQAADwAAAAAAAAAAAAAAAADNCQAAeGwvd29ya2Jvb2sueG1sUEsBAhQAFAAICAgAFAZiU4YDO5HUAAAAMwIAABoAAAAAAAAAAAAAAAAA6woAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzUEsBAhQAFAAICAgAFAZiU7swSvaoAwAAOxEAABgAAAAAAAAAAAAAAAAABwwAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLBQYAAAAACQAJAD8CAAD1DwAAAAA=";

    this.reportesPrd.crearArchivo(base64,"pocoyo","xlsx");
  }



}
