import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstilosService {

  private fondo:Array<estructura> = [
    {etiqueta:".contenido_component .content",selector:["background-color"]},
    {etiqueta:".contenido_component #sidebar ul li.active > a",selector:["background-color"]},
    {etiqueta:".labelflotantemenu",selector:["background-color"]},
    {etiqueta:".contenido_component #sidebar ul li.active > a i",selector:["background-color"],contraste:true},
    {etiqueta:".titulosfijos",selector:["background-color"]},
    {etiqueta:".mostrarelementos label",selector:["background"]}
  ];
  private menu:Array<estructura> = [
    {etiqueta:"#sidebar ul li a",selector:["background-color"]},
    {etiqueta:"#sidebar ul li a i",selector:["background-color"],contraste:true},
    {etiqueta:"titulo-outlet",selector:["background-color"]},
    {etiqueta:"#navegadorTabsEncab",selector:["background-color"]},
    {etiqueta:".tituloPanelInicio",selector:["background-color"]},
    {etiqueta:".contenido_component #sidebar ul li a:hover i",selector:["background-color"],contraste:true},
    {etiqueta:".tituloabajoimg article",selector:["color"]},
    {etiqueta:"::-webkit-scrollbar-thumb",selector:["background-color"]},
    {etiqueta:".pagination .page-item.active .page-link",selector:["background-color"]},
    {etiqueta:".button-outlet",selector:["border-color","color"]},
    {etiqueta:".button-fill",selector:["background-color","border-color"]},
    {etiqueta:".cabeceraalerta",selector:["background-color"]}
    
  ];

  constructor() { }


  public getFondo():Array<estructura>{
      return this.fondo;
  } 

  public getMenu():Array<estructura>{
      return this.menu;
  }
}


export interface estructura{
   etiqueta:string;
   selector:string[];
   contraste?:boolean
}
