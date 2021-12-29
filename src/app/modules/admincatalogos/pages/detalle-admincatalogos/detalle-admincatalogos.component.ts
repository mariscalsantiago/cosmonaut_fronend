import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';
import {Utilidades} from '../../../../shared/utilidades/utilidades';


@Component({
  selector: 'app-detalle-admincatalogos',
  templateUrl: './detalle-admincatalogos.component.html',
  styleUrls: ['./detalle-admincatalogos.component.scss']
})
export class DetalleAdminCatalogosComponent implements OnInit {





  public cargando: Boolean = false;
  public tipoguardad: boolean = false;



  /*
    Directivas de filtros
  */


  public id_catalogo: number = 0;
  public descripcion: string = "";


  /*

    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloListaCatalogos: any = [];
  public listaTablas: any = [];
  public listaTablasFinal: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;
  public objdetcat: any = [];



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };

  public esRegistrar:boolean = false;
  public esEditar:boolean = false;
  public envio: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.establecerPermisos();

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.objdetcat = history.state.data == undefined ? {} : history.state.data;
    this.adminCatalogosPrd.getListaCatalgos(true).subscribe(datos => this.arregloListaCatalogos = datos.datos);
    this.listaTablasFinal =[];
    this.listaTablas = [];
    if(this.objdetcat.listaCatalogosId == 1){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();
    }

    else if(this.objdetcat.listaCatalogosId == 13){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 21){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
        this.adminCatalogosPrd.getListaDispersion().subscribe(datos => {
        this.listaTablasFinal  = datos.datos;
        this.crearTabla(this.listaTablasFinal);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 22){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
        this.adminCatalogosPrd.getListaTimbrado().subscribe(datos => {
          this.listaTablasFinal  = datos.datos;
          this.crearTabla(this.listaTablasFinal);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 9){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 12){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 8){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 6){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 17){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
        this.adminCatalogosPrd.getListatablasPeriodicasISR().subscribe(datos => {
          this.listaTablasFinal  = datos.datos;
          this.crearTabla(this.listaTablasFinal);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 18){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
        this.adminCatalogosPrd.getListaTablasSubsidioISR().subscribe(datos => {
          this.listaTablasFinal  = datos.datos;
          this.crearTabla(this.listaTablasFinal);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 19){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.cargando = true;
        this.adminCatalogosPrd.getListaEstadosISN().subscribe(datos => {
          this.listaTablasFinal  = datos.datos;
          this.crearTabla(this.listaTablasFinal);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 7){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 5){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 10){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 4){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 11){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 15){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();
    }

    else if(this.objdetcat.listaCatalogosId == 14){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 20){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 3){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 2){
      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }
    else if(this.objdetcat.listaCatalogosId == 16){

      this.id_catalogo = this.objdetcat.descripcion?.toUpperCase();
      this.filtrar();

    }

    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;

  }

  public establecerPermisos(){

    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
  }

  public crearTabla(obj:any) {

    this.arreglo = obj;

    let columnas: Array<tabla> = [
      new tabla("descripcion", "Descripción"),
      new tabla("clave", "Clave/Id"),
      new tabla("activoEst", "Estatus ")
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    if(this.arreglo !== undefined){

    for(let item of this.arreglo){
      if(item.esActivo !== undefined){
        if (item.esActivo) {
          item.activoEst = 'Activo'
        }
        if (!item.esActivo) {
          item.activoEst = 'Inactivo'
        }
      }
      else if(item.activo !== undefined){
        if (item.activo) {
          item.activoEst = 'Activo'
        }
        if (!item.activo) {
          item.activoEst = 'Inactivo'
        }
      }

      if(item.tipoValorReferenciaId?.descripcion !== undefined){
        item.descripcion = item.tipoValorReferenciaId?.descripcion;
      }
      else if(item.urlMarcoJuridico !== undefined){
        item.descripcion = item.urlMarcoJuridico;
      }
      else if(item.tabla !== undefined){
        item.descripcion = item.tabla;
      }
      else if(item.estado !== undefined){
        item.descripcion = item.estado;
      }
      else if(item.descripcion !== undefined){
        item.descripcion = item.descripcion;
      }else {
        item.descripcion = item.nombreCorto;

      }

      if(item.codBanco !== undefined){
        item.clave = item.codBanco;
      }
      else if(item.regimenfiscalId !== undefined){
        item.clave = item.regimenfiscalId;
      }
      else if(item.facultadPoderId !== undefined){
        item.clave = item.facultadPoderId;
      }
      else if(item.proveedorDispersionId !== undefined){
        item.clave = item.proveedorDispersionId;
      }
      else if(item.proveedorTimbradoId !== undefined){
        item.clave = item.proveedorTimbradoId;
      }
      else if(item.motivoBajaId !== undefined){
        item.clave = item.motivoBajaId;
      }
      else if(item.tipoRegimenContratacionId !== undefined){
        item.clave = item.tipoRegimenContratacionId;
      }
      else if(item.tipoContratoId !== undefined){
        item.clave = item.tipoContratoId;
      }
      else if(item.tipoIncapacidadId !== undefined){
        item.clave = item.tipoIncapacidadId;
      }
      else if(item.tipoIncidenciaId !== undefined){
        item.clave = item.tipoIncidenciaId;
      }
      else if(item.tipoPercepcionId !== undefined){
        item.clave = item.tipoPercepcionId;
      }
      else if(item.tipoDeduccionId !== undefined){
        item.clave = item.tipoDeduccionId;
      }
      else if(item.tipoValorReferenciaId?.tipoValorReferenciaId !== undefined){
        item.clave = item.tipoValorReferenciaId?.tipoValorReferenciaId;
      }

      else if(item.tasaAplicableIsnId !== undefined){
        item.clave = item.tasaAplicableIsnId;
      }
      else if(item.funcionCuentaId !== undefined){
        item.clave = item.funcionCuentaId;
      }
      else if(item.metodoPagoId !== undefined){
        item.clave = item.metodoPagoId;
      }
      else if(item.monedaId !== undefined){
        item.clave = item.monedaId;
      }
      else if(item.nacionalidadId !== undefined){
        item.clave = item.nacionalidadId;
      }
      else if(item.tipoValorReferenciaId !== undefined){
        item.clave = item.tipoValorReferenciaId;
      }
      else if(item.estadoId !== undefined){
        item.clave = item.estadoId;
      }
      else if(item.periodo !== undefined){
        item.clave = item.periodo;
      }
    }
  }


    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }

  public cancelar() {

    this.routerPrd.navigate(['/admincatalogos']);
  }



  public verdetalle(obj: any) {

    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['admincatalogos', 'detalle_admincatalogos', tipoinsert], { state: { datos: this.objdetcat, data: obj } });
    this.cargando = false;
  }


  public filtrar() {
    const util = new Utilidades();
    this.envio = {
      "descripcion": this.descripcion
    }
   this.listaTablas=undefined;
   this.cargando = true;

   this.descripcion = util.quitarAcentosYEspacios(this.descripcion);


   if(this.objdetcat.listaCatalogosId == 1){
         this.adminCatalogosPrd.ListaBanco(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
          this.listaTablas = datos.datos;
          }
          this.crearTabla(this.listaTablas);
        });

  }

  else if(this.objdetcat.listaCatalogosId == 13){
      this.adminCatalogosPrd.ListaFacultad(this.envio).subscribe(datos => {
        if(datos.datos !== undefined){
          this.listaTablas = datos.datos;
          }
          this.crearTabla(this.listaTablas);
        });

  }
  else if(this.objdetcat.listaCatalogosId == 21){
      this.adminCatalogosPrd.ListaDispersion(this.envio).subscribe(datos => {
        if(datos.datos !== undefined){
          this.listaTablas = datos.datos;
          }
          this.crearTabla(this.listaTablas);
        });

  }
  else if(this.objdetcat.listaCatalogosId == 22){
      this.adminCatalogosPrd.ListaTimbrado(this.envio).subscribe(datos => {
        if(datos.datos !== undefined){
          this.listaTablas = datos.datos;
          }
          this.crearTabla(this.listaTablas);
        });

  }
  else if(this.objdetcat.listaCatalogosId == 9){
        this.adminCatalogosPrd.ListaMotivoBaja(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 12){
        this.adminCatalogosPrd.ListaParentesco(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });
  }
  else if(this.objdetcat.listaCatalogosId == 8){
         this.adminCatalogosPrd.ListaRegimenContratacion(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 15){
     this.adminCatalogosPrd.ListaReferencia(this.envio).subscribe(datos => {
      if(datos.datos !== undefined){
        this.listaTablas = datos.datos;
        }
        this.crearTabla(this.listaTablas);
      });

  }
  else if(this.objdetcat.listaCatalogosId == 6){
        this.adminCatalogosPrd.ListaRegimenFiscal(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }

  else if(this.objdetcat.listaCatalogosId == 7){
        this.adminCatalogosPrd.ListaTipoContrato(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 5){
        this.adminCatalogosPrd.ListaTipoDeduccion(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 10){
        this.adminCatalogosPrd.ListaTipoIncapacidad(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });
  }
  else if(this.objdetcat.listaCatalogosId == 4){
        this.adminCatalogosPrd.ListaTipoPercepcion(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 11){
        this.adminCatalogosPrd.ListaTipoEvento(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 14){
        this.adminCatalogosPrd.ListaFuncionCuenta(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 20){
        this.adminCatalogosPrd.ListaMetodoPago(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 3){
        this.adminCatalogosPrd.ListaMoneda(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 2){
        this.adminCatalogosPrd.ListaNacionalidad(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }
  else if(this.objdetcat.listaCatalogosId == 16){
        this.adminCatalogosPrd.ListaTipoValorReferencia(this.envio).subscribe(datos => {
          if(datos.datos !== undefined){
            this.listaTablas = datos.datos;
            }
            this.crearTabla(this.listaTablas);
          });

  }

  }


  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
    }

  }


}

