import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-listagruposnominas',
  templateUrl: './listagruposnominas.component.html',
  styleUrls: ['./listagruposnominas.component.scss']
})
export class ListagruposnominasComponent implements OnInit {


  public tamanio:number = 0;
  public changeIconDown:boolean = false;
  public nombre:string = "";
  public cargando:boolean = false;
  public id_empresa:number = 0;

  public arreglo:any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  constructor(private gruposnominaPrd:GruponominasService,private routerPrd:Router,
    private routerActive:ActivatedRoute) { }

  ngOnInit(): void {

    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos =>{
      this.id_empresa = datos["id"];

      this.cargando = true;

      this.gruposnominaPrd.getAll(this.id_empresa).subscribe(datos =>{
        if(datos.data != undefined)
          for(let item of datos.data)
            item.seleccionado = false;
        this.arreglo = datos.data;
        this.cargando = false;
      });

    });

  }

  public filtrar(){

  }


  public eliminar(obj:any){

  }

  public verdetalle(obj:any ){


    if(obj == undefined){
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'nuevo']);
    }else{
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'editar'],{ state: { data: obj}});
    }

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
