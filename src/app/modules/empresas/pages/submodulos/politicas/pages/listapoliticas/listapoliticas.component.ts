import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticasService } from '../services/politicas.service';

@Component({
  selector: 'app-listapoliticas',
  templateUrl: './listapoliticas.component.html',
  styleUrls: ['./listapoliticas.component.scss']
})
export class ListapoliticasComponent implements OnInit {

  
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

  constructor(private routerPrd:Router,private politicasProd:PoliticasService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
    debugger;
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.politicasProd.getAllArea().subscribe(datos => {
      this.arreglo = datos.data;
      console.log(this.arreglo);
      this.cargando = false;
      //this.paginar();
    });

    });

  }


  public verdetalle(obj:any){
    debugger;
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'politicas', tipoinsert],{state:{data:obj}});
    this.cargando = false;
  }
  public eliminar(obj:any){

  }

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }

  
}


