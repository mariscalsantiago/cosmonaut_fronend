import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';


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
  public idUsuario: any = "";
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;


  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloListaCatalogos: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;
  public objdetcat: any = [];



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    

    this.objdetcat = history.state.data == undefined ? {} : history.state.data;
    this.adminCatalogosPrd.getListaCatalgos(true).subscribe(datos => this.arregloListaCatalogos = datos.datos);
    
    if(this.objdetcat.listaCatalogosId == 1){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaBanco(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }

    else if(this.objdetcat.listaCatalogosId == 13){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaFacultad(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 9){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaMotivoBaja(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 12){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaParentesco(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 8){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaRegimenContratacion(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 6){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaRegimenFiscal(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 17){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListatablasPeriodicasISR().subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 18){
      
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTablasSubsidioISR().subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 19){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaEstadosISN().subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 7){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoContrato(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 5){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoDeduccion(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 10){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoIncapacidad(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 4){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoPercepcion(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 11){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoEvento(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 15){
      
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
      let fecha = new Date();
      let anio = fecha.getFullYear();
        this.adminCatalogosPrd.getListaReferencia(anio).subscribe(datos => {
        this.crearTabla(datos);
       });

    }

    else if(this.objdetcat.listaCatalogosId == 14){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaFuncionCuenta(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 20){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaMetodoPago(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 3){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaMoneda(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 2){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaNacionalidad(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }
    else if(this.objdetcat.listaCatalogosId == 16){
      this.id_catalogo = this.objdetcat.listaCatalogosId;
      this.cargando = true;
        this.adminCatalogosPrd.getListaTipoValorReferencia(true).subscribe(datos => {
        this.crearTabla(datos);
       });

    }

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

  }

  public crearTabla(obj:any) {
    
    this.arreglo = obj.datos;

    let columnas: Array<tabla> = [
      new tabla("descripcion", "Descripción"),
      new tabla("clave", "Clave/Id")
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    for(let item of this.arreglo){ 
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
      else if(item.motivoBajaId !== undefined){
        item.clave = item.motivoBajaId;
      }
      else if(item.tipoRegimenContratacionId !== undefined){
        item.clave = item.tipoRegimenContratacionId;
      }
      else if(item.tipoContratoId !== undefined){
        item.clave = item.tipoContratoId;
      }
      else if(item.tipoDeduccionId !== undefined){
        item.clave = item.tipoDeduccionId;
      }
      else if(item.tipoIncapacidadId !== undefined){
        item.clave = item.tipoIncapacidadId;
      }
      else if(item.tipoPercepcionId !== undefined){
        item.clave = item.tipoPercepcionId;
      }
      else if(item.tipoIncidenciaId !== undefined){
        item.clave = item.tipoIncidenciaId;
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
    
    this.cargando = true;

    let fechar = "";

    if (this.fechaRegistro !== undefined || this.fechaRegistro !== null) {


      if (this.fechaRegistro !== "") {
        const fecha1 = new Date(this.fechaRegistro).toUTCString().replace("GMT", "");
        fechar = `${new Date(fecha1).getTime()}`;
      }
    }

    let actboo: string = "";

    if (this.activo == 1) {
      actboo = "true";
    } else if (this.activo == 2) {
      actboo = "false";
    }


    let peticion = {
      personaId: this.idUsuario,
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPat,
      apellidoMaterno: this.apellidoMat,
      fechaAlta: fechar,
      emailCorporativo: this.correoempresarial.toLowerCase(),
      esActivo: actboo,
      centrocClienteId: {
        centrocClienteId: ""
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }

    this.cargando = true;

    /*this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;

      this.procesarTabla({ datos: this.arreglo });

      this.cargando = false;
    });*/

  }


  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
    }

  }


}

