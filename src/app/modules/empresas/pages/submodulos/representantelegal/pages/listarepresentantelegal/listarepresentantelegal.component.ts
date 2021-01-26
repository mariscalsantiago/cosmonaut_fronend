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

    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{


      this.id_empresa = datos["id"]
      this.representanteProd.getByRep(this.id_empresa).subscribe(datos =>{
        this.arreglo = datos.data;
        this.cargando = false;
      });

    });

  }


  public verdetalle(obj:any){
    //debugger;
    this.cargando = true;
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'representantelegal','nuevo']);
    this.cargando = false;
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


