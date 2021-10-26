import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ContenidoComponent } from 'src/app/layout/contenido/contenido/contenido.component';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { Noticia } from './../../../core/modelos/noticia';
import { NoticiasService } from './../../noticias/services/noticias.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public arreglopintar: any = [false];
  public idEmpresa: number = -1;
  public valor: any;
  public eventos: any;
  public vistosRec: any = undefined;
  public apareceListadoEventos: boolean = false;
  public vistosTrue: boolean = false;
  public vistosFalse: boolean = false;

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

  noticiasAdministrador: Noticia[] = [];
  noticiasEmpresa: Noticia[] = [];
  noticiasListado: Noticia[] = [];
  noticiasCursos: Noticia[] = [];

  constructor(
    private eventoPrd: EventosService,
    private catalogos: CatalogosService,
    private routerPrd: Router,
    private reportesPrd: ReportesService,
    private modalPrd: ModalService,
    private serviceNoticia: NoticiasService,
    private usuariosSistemaPrd: UsuarioSistemaService,
    public ContenidoComponent: ContenidoComponent,
    public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {

    this.cargando = true;
    this.idEmpresa = this.usuariosSistemaPrd.getIdEmpresa();

    if (this.puedeConsultarKiosko()) {

      this.serviceNoticia.getNoticiasEmpleado(this.idEmpresa).subscribe(

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
    console.log("Se ejecuta la funcion");
    var evtSource = new EventSource("http://192.168.1.68:8080/prueba/nomina", { withCredentials: true});

    evtSource.onmessage = function (e) {
        console.log("Se puede");
        console.log(e.data);
        console.log(e);
    };
  }

}
