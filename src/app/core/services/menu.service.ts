import { Injectable } from '@angular/core';
import {menuprincipal,submenu} from '../data/estructuramenu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
  private arreglo: Array<menuprincipal> = [
    { nombre: "INICIO", icono: "icon_home", seleccionado: true,seleccionadosubmenu:false,routerLink:['/inicio'] },
    { nombre: "EMPLEADOS", icono: "icon_nominas", seleccionado: false ,seleccionadosubmenu:false},
    { nombre: "NOMINAS", icono: "icon_empleados", seleccionado: false,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"COMPLETAR",routerLink:[]},
                                                                                {nombre:"LISTA",routerLink:[]},
                                                                                {nombre:"DAR DE ALTA",routerLink:[]},
                                                                                {nombre:"DAR DE BAJA",routerLink:[]},
                                                                                {nombre:"DIRECTORIO",routerLink:[]}
                                                                              ]},
    { nombre: "EVENTOS", icono: "icon_eventos", seleccionado: false ,seleccionadosubmenu:false,routerLink:[]},
    { nombre: "IMSS", icono: "icon_imss", seleccionado: false,seleccionadosubmenu:false,routerLink:[] },
    { nombre: "REPORTES", icono: "icon_reportes", seleccionado: false,seleccionadosubmenu:false,routerLink:[] },
    { nombre: "MI PERFIL", icono: "icon_perfil", seleccionado: false ,seleccionadosubmenu:false,routerLink:[]},
    { nombre: "CONFIGURACIÓN", icono: "icon_admon", seleccionado: false ,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"COMPAÑIA",routerLink:['/company']},
                                                                                {nombre:"USUARIOS",routerLink:['/usuarios']},
                                                                              ]}
  ];

  constructor() { }


  public getMenu():Array<menuprincipal>{
    return this.arreglo;
  }
}




