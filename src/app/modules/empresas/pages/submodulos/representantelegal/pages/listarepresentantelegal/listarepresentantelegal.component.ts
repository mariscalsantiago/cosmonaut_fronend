import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepresentanteLegalService } from '../services/representantelegal.service';

@Component({
  selector: 'app-listarepresentantelegal',
  templateUrl: './listarepresentantelegal.component.html',
  styleUrls: ['./listarepresentantelegal.component.scss']
})
export class ListarepresentantelegalComponent implements OnInit {

  
  public tamanio:number = 0;
  public cargando:Boolean = false;
  public id_empresa:number = 0;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  public changeIconDown: boolean = false;
  public numeroitems: number = 5;
  public arreglopaginas: Array<any> = [];


  public id_company: number = 0;

  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public contactoInicialEmailPersonal: string = "";
  public emailCorporativo: string = "";


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private representanteProd:RepresentanteLegalService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {

    debugger;
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.representanteProd.getAllUsersRep().subscribe(datos => {
      this.arreglo = datos.datos;
      console.log(this.arreglo);
      this.cargando = false;
      this.paginar();
    });

    });

  }


  public verdetalle(obj:any){
    debugger;
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'representantelegal', tipoinsert],{state:{data:obj}});
    this.cargando = false;
  }

  public filtrar() {
    debugger;

    this.cargando = true;

    let peticion = {

      nombre: this.nombre,
      apellidoPaterno: this.apellidoMaterno,
      apellidoMaterno: this.apellidoMaterno,
      emailCorporativo: this.emailCorporativo,
      contactoInicialEmailPersonal: this.contactoInicialEmailPersonal,
      centrocClienteId: {
        centrocClienteId: (this.id_company) == 0 ? "" : this.id_company
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    } 
 


    this.representanteProd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;
      console.log(datos);
      this.cargando = false;
    });








  }

  public paginar() {

    this.arreglopaginas = [];

    if (this.arreglo != undefined) {
      let paginas = this.arreglo.length / this.numeroitems;


      let primero = true;
      paginas = Math.ceil(paginas);

      for (let x = 1; x <= paginas; x++) {

        this.arreglopaginas.push({ numeropagina: (x - 1) * 2, llavepagina: ((x - 1) * 2) + this.numeroitems, mostrar: x, activado: primero });
        primero = false;
      }

      this.arreglo = this.arreglo.slice(0, this.numeroitems);
      console.log(this.arreglo);

    }

  }


  public paginacambiar(item: any) {


    this.arreglo = this.arreglo.slice(item.numeropagina, item.llavepagina);



    for (let item of this.arreglopaginas) {
      item.activado = false;
    }

    item.activado = true;


  }

  public cambia() {

    this.paginar();

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


