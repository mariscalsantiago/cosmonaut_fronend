import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { triggerAsyncId } from 'async_hooks';
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


  public id_catalogo: string = "0";
  public idUsuario: any = "";
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;
  public objFiltro: any = [];
  public arregloFiltro: any = [];


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
    debugger;
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;
    
      this.adminCatalogosPrd.getListaCatalgos(true).subscribe(datos => {
      this.procesarTabla(datos);
    });

    

  }

  public procesarTablaFiltro(obj:any) {
    debugger;
    this.arregloFiltro= obj;
    let columnas: Array<tabla> = [
      new tabla("descripcion", "Catálogo")
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    for(let item of this.arregloFiltro){
      item.descripcion = item.nombreCatalogo;
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arregloFiltro;

    this.cargando = false;
  }

  public procesarTabla(obj:any) {
    debugger;
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
    debugger;
    
    this.cargando = true;
    
    this.adminCatalogosPrd.getListaCatalgos(true).subscribe(datos => {
      
      if(this.id_catalogo !== "0"){
      this.arregloFiltro = datos.datos;
      this.filtroCatalogo();
      this.procesarTablaFiltro(this.objFiltro);
      }else{

      this.procesarTabla(datos);
      }

    });
  }

  public filtroCatalogo(){

    for(let item of this.arregloFiltro){
      if(item.listaCatalogosId == this.id_catalogo){

        this.objFiltro = [
            item
        
      ]
      }
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








