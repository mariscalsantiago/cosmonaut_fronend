import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablapaginado',
  templateUrl: './tablapaginado.component.html',
  styleUrls: ['./tablapaginado.component.scss']
})
export class TablapaginadoComponent implements OnInit {

  public cargando:boolean = false;
  public arreglo:any = [];
  public numeroitems:number = 5;

  estructuratabla:any;

  public columnas:any = [];


  constructor() { }

  ngOnInit(): void {

    // for(let llave in this.estructuratabla){

    //   let nombrecolumna:string = this.estructuratabla[llave].nombrecolumna;

    // }

  }


  public cambia(){

  }

  public verdetalle(obj:any){

  }

}
