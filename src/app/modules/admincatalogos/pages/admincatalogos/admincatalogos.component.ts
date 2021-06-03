import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';



@Component({
  selector: 'app-admincatalogos',
  templateUrl: './admincatalogos.component.html',
  styleUrls: ['./admincatalogos.component.scss']
})
export class AdminCatalogosComponent implements OnInit {



  public cargando: Boolean = false;
  public tipoguardad: boolean = false;



  /*
    Directivas de filtros
  */


  public id_company: number = 0;
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
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
     private modalPrd: ModalService) { }

  ngOnInit(): void {
  
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;
    
      this.adminCatalogosPrd.getListaCatalgos(true).subscribe(datos => {
      this.procesarTabla(datos);
    });

    

  }

  public procesarTabla(obj:any) {
    this.arreglo = obj.datos;
    
    let columnas: Array<tabla> = [
      new tabla("descripcion", "Catálogo")
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    for(let item of this.arreglo){
      item.descripcion = item.nombreCatalogo;
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }





  public verdetalle(obj: any) {
      
      this.routerPrd.navigate(['admincatalogos', 'detalle_admincatalogos', "detalle"],{state:{data:obj}});
  }


  public filtrar() {
    
    this.cargando = true;

    let fechar = "";

    if (this.fechaRegistro != undefined || this.fechaRegistro != null) {


      if (this.fechaRegistro != "") {
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
      emailCorporativo: this.correoempresarial,
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








