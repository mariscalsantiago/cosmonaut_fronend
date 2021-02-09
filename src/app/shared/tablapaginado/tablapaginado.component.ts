import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablapaginado',
  templateUrl: './tablapaginado.component.html',
  styleUrls: ['./tablapaginado.component.scss']
})
export class TablapaginadoComponent implements OnInit {

  @Input() public cargando:boolean = false;
  public arreglo:any = [];
  public numeroitems:number = 5;

  estructuratabla:any;

  @Input() public datos = {
    columnas:[],
    filas:[]
  }




  constructor() { }

  ngOnInit(): void {

   
  }


  public cambia(){

  }

  public verdetalle(obj:any){

  }

}
