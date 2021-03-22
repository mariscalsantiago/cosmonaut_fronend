import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'path';
import { tabla } from 'src/app/core/data/tabla';
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
  public rfc: string = "";
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

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public changeIconDown: boolean = false;


  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };

  constructor(private routerPrd: Router, private companyProd: CompanyService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.companyProd.getAll().subscribe(datos => {
      this.arreglo = datos.datos;

      let columnas: Array<tabla> = [
        new tabla("url", "imagen"),
        new tabla("centrocClienteId", "ID empresa"),
        new tabla("razonSocial", "Razón social	"),
        new tabla("nombre", "Nombre de compañía"),
        new tabla("rfc", "RFC"),
        new tabla("fechaAlta", "Fecha registro"),
        new tabla("esActivo", "Estatus")
      ]
      if (this.arreglo !== undefined) {
        for (let item of this.arreglo) {
          item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y');
        }
      }

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;
    });

  }


  public verdetallecom(obj: any) {
    this.routerPrd.navigate(['company', 'detalle_company', 'nuevo'], { state: { datos: undefined } });
  }

  public filtrar() {




    this.cargando = true;

    let fechar = "";

    if (this.fechaAlta != undefined || this.fechaAlta != null) {

      if (this.fechaAlta != "") {

        const fecha1 = new Date(this.fechaAlta).toUTCString().replace("GMT", "");
        fechar = `${new Date(fecha1).getTime()}`;


      }

    }

    let actboo: string = "";

    if (this.esActivo == "1") {
      actboo = "true";
    } else if (this.esActivo == "2") {
      actboo = "false";
    }


    let peticion = {
      centrocClienteId: this.centrocClienteId,
      rfc: this.rfc,
      nombre: this.nombre,
      razonSocial: this.razonSocial,
      fechaAlta: fechar,
      esActivo: "",
    }


    this.companyProd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;



      this.arreglo = datos.datos;

      let columnas: Array<tabla> = [
        new tabla("url", "imagen"),
        new tabla("centrocClienteId", "ID empresa"),
        new tabla("razonSocial", "Razón social	"),
        new tabla("nombre", "Nombre de compañía"),
        new tabla("rfc", "RFC"),
        new tabla("fechaAlta", "Fecha registro"),
        new tabla("esActivo", "Estatus")
      ];

      if (this.arreglo !== undefined) {
        for (let item of this.arreglo) {
          item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y');

        }
      }
      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;


      this.cargando = false;

    });



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
    if (obj.type == "editar") {
      this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
  }


}
