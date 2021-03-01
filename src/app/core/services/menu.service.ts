import { Injectable } from '@angular/core';
import {menuprincipal,submenu} from '../data/estructuramenu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public tipoinsert: string = 'nuevo';
  private arreglo: Array<menuprincipal> = [
    { nombre: "INICIO", icono: "icon_home", seleccionado: true,seleccionadosubmenu:false,routerLink:['/inicio'] },
    { nombre: "NOMINAS", icono: "icon_nominas", seleccionado: false ,seleccionadosubmenu:false},
    { nombre: "EMPLEADOS", icono: "icon_empleados", seleccionado: false,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"LISTA",routerLink:['/empleados']},
                                                                                {nombre:"DIRECTORIO",routerLink:[]}
                                                                              ]},
    { nombre: "EVENTOS", icono: "icon_eventos", seleccionado: false ,seleccionadosubmenu:false,routerLink:[]},
    { nombre: "IMSS", icono: "icon_imss", seleccionado: false,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"IDSE",routerLink:['imss','idse']},
                                                                                {nombre:"MOVIMIENTOS",routerLink:[]},
                                                                                {nombre:"VARIABILIDAD",routerLink:[]}] },
    { nombre: "REPORTES", icono: "icon_reportes", seleccionado: false,seleccionadosubmenu:false,routerLink:[] },
    { nombre: "MI PERFIL", icono: "icon_perfil", seleccionado: false ,seleccionadosubmenu:false,routerLink:[]},
    { nombre: 'CONFIGURACIÓN', icono: "icon_admoncos", seleccionado: false ,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"COMPAÑIA",routerLink:['/company']},
                                                                                {nombre:"USUARIOS",routerLink:['/usuarios']},
                                                                              ]},
    { nombre: "ADMINISTRACIÓN", icono: "icon_admon", seleccionado: false ,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"CONFIGURACIÓN EMPRESA",routerLink:['/listaempresas']},
                                                                                {nombre:"EMPRESA",routerLink:['listaempresas', 'empresas', this.tipoinsert]},
                                                                              ]},
  ];

  constructor() { }


  public getMenu():Array<menuprincipal>{
    return this.arreglo;
  }
}




