import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'path';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { CompanyService } from '../../services/company.service';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public id_company: number = 0;
  public centrocClienteId: any = "";
  public rfc: any = "";
  public nombre: string = "";
  public razonSocial: string = "";
  public fechaAlta: any = null;
  public esActivo: string = "";

  public modal: boolean = false;
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public iconType: string = "";
  public tamanio: number = 0;
  public cargando: Boolean = false;
  public peticion: any = [];

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public changeIconDown: boolean = false;
  public multiempresa: string = '0';
  public multiempresaFin: boolean = false;

  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: [],
    totalRegistros:0
  };

  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };

  public esRegistrar: boolean = false;
  public esEditar: boolean = false;

  public modulo: string = "";
  public subModulo: string = "";


  public elementos: number = 0;
  public pagina: number = 0;
  public primeraVez:boolean = false;

  constructor(private routerPrd: Router, private companyProd: CompanyService, public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();


    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;
    this.primeraVez = true;
  }


  public verdetallecom(obj: any) {
    this.routerPrd.navigate(['company', 'detalle_company', 'nuevo'], { state: { datos: undefined } });
  }

  public establecerPermisos() {

    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
  }

  public filtrar(repetir: boolean = false,desdefiltrado:boolean = false) {
    

    this.cargando = true;

    delete this.peticion.multiempresa;
    if (this.multiempresa == '1') {
      this.multiempresaFin = true;
      this.peticion = {
        ...this.peticion,
        multiempresa: this.multiempresaFin,
      }

    }
    else if (this.multiempresa == '2') {
      this.multiempresaFin = false;
      this.peticion = {
        ...this.peticion,
        multiempresa: this.multiempresaFin,
      }
    }

    let actboo: string = "";

    if (this.esActivo == "1") {
      actboo = "true";
    } else if (this.esActivo == "2") {
      actboo = "false";
    }


    this.peticion = {
      ...this.peticion,
      centrocClienteId: this.centrocClienteId,
      rfc: this.rfc,
      nombre: this.nombre,
      razonSocial: this.razonSocial,
      fechaAlta: this.fechaAlta,
      esActivo: actboo,
    }


    if(!desdefiltrado){
      this.companyProd.filtrarPaginado(this.peticion, this.elementos, this.pagina).subscribe(datos => {
      
        let arreglo: Array<any> = datos.datos.lista;
        if (arreglo)
          if (!repetir)
            arreglo.forEach(o => this.arreglo.push(o));
          else
            this.arreglo = arreglo;
  
  
        this.arreglotabla.totalRegistros = datos.datos.totalResgistros;
  
  
        let columnas: Array<tabla> = [
          new tabla("url", "imagen"),
          new tabla("centrocClienteId", "ID cliente"),
          new tabla("razonSocial", "Razón social	"),
          new tabla("nombre", "Nombre de cliente"),
          new tabla("rfc", "RFC"),
          new tabla("fechaAltab", "Fecha de registro en el sistema"),
          new tabla("activo", "Estatus de cliente")
        ];
  
        if (this.arreglo !== undefined) {
          for (let item of this.arreglo) {
            item.fechaAltab = new DatePipe("es-MX").transform(item.fechaAlta, 'dd-MMM-y');
  
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
          filas: this.arreglo,
          totalRegistros:this.arreglotabla.totalRegistros
        }
        this.cargando = false;
  
      });
    }else{
      this.arreglotabla = {
        reiniciar:desdefiltrado||undefined
      }
      this.cargando = true;
      this.primeraVez = true;
    }



  }


  public activarMultiseleccion() {
    this.multiseleccion = true;
  }


  public guardarMultiseleccion() {
    this.multiseleccionloading = true;
    setTimeout(() => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    }, 3000);
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }



  public recibirTabla(obj: any) {

    
    switch (obj.type) {
      case "editar":
        this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
        break;
      case "paginado_cantidad":
        this.elementos = obj.datos.elementos;
        this.pagina = obj.datos.pagina;
        if (!this.cargando || this.primeraVez) {
          this.primeraVez = false;
          this.filtrar(obj.nuevos);
        }
        break;
    }
  }


}
