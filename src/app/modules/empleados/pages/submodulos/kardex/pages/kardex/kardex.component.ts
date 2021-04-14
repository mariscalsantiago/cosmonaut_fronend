import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public tamanio:number = 0;
  public cargando:Boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  
  constructor() { }

  ngOnInit(): void {

    let documento:any = document.defaultView;
    this.tamanio = documento.innerWidth;

    this.cargando = true;

        /*this.companyProd.getAll().subscribe(datos =>{
          this.arreglo = datos.datos;
          let columnas:Array<tabla> = [
            new tabla("url","imagen"),
            new tabla("centrocClienteId","ID empresa"),
            new tabla("razonSocial","Razón social	"),
            new tabla("nombre","Nombre de la empresa	"),
            new tabla("rfc","RFC"),
            new tabla("fechaAlta","Fecha de registro en el sistema"),
            new tabla("esActivo","Estatus")
          ]
          this.arreglotabla.columnas = columnas;
          this.arreglotabla.filas = this.arreglo;
          this.cargando = false;
      });*/

  }
  public filtrar() {
  
  }

}
