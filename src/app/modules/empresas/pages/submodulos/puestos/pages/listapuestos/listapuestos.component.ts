import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PuestosService } from '../services/puestos.service';

@Component({
  selector: 'app-listapuestos',
  templateUrl: './listapuestos.component.html',
  styleUrls: ['./listapuestos.component.scss']
})
export class ListapuestosComponent implements OnInit {

  
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

 
  public arreglo:any = [];

  constructor(private routerPrd:Router,private puestosProd:PuestosService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
    debugger;
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{


      this.id_empresa = datos["id"]
      this.puestosProd.getByRep(this.id_empresa).subscribe(datos =>{
        this.arreglo = datos.data;
        this.cargando = false;
      });

    });

  }


  public verdetalle(obj:any){
    debugger;
    this.cargando = true;
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'puestos','nuevo']);
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


