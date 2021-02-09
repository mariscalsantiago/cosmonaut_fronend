import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public esActivo: number = 0;

  public modal:boolean = false;
  public strTitulo:string = "";
  public strsubtitulo:string = "";
  public iconType:string = "";
  public tamanio:number = 0;
  public cargando:Boolean = false;

  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  public changeIconDown: boolean = false;


  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private companyProd:CompanyService) { }

  ngOnInit(): void {

    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

        this.companyProd.getAll().subscribe(datos =>{

        this.arreglo = datos.datos;
        console.log("compania-->>",this.arreglo);
        this.cargando = false;
      });

  }


  public verdetallecom(obj:any){
    
    this.cargando = true;
    let tipoinsert = (obj == undefined)? 'nuevo':'modifica';
    this.routerPrd.navigate(['company','detalle_company',tipoinsert],{state:{datos:obj}});
    this.cargando = false;
  
  }

  public filtrar() {




    this.cargando = true;

    let fechar = "";

    if (this.fechaAlta != undefined || this.fechaAlta != null) {

      if (this.fechaAlta != "") {


        let arre = this.fechaAlta.split('-');
        fechar = arre[2] + "/" + arre[1] + "/" + arre[0];

      }

    }

    let actboo: string = "";

    if (this.esActivo == 1) {
      actboo = "true";
    } else if (this.esActivo == 2) {
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
      this.cargando = false;
      console.log(this.arreglo);
    });



  }


  public activarMultiseleccion(){
      this.multiseleccion = true;
  }


  public guardarMultiseleccion(){
    this.multiseleccionloading = true;
      setTimeout(() => {
        this.multiseleccionloading = false;
        this.multiseleccion = false;
      }, 3000);
  }


  public cancelarMulti(){
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }

}
