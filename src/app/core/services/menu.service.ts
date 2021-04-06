import { Injectable } from '@angular/core';
import {menuprincipal,submenu} from '../data/estructuramenu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  public tipoinsert: string = 'nuevo';
  private arreglo: Array<menuprincipal> = [
    { nombre: "INICIO", icono: "icon_home", seleccionado: true,seleccionadosubmenu:false,rol:["ALL","ADMINCOMPANIA","ADMINEMPRESA"],routerLink:['/inicio'] },
    { nombre: "NOMINAS", icono: "icon_nominas", seleccionado: false ,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"]},
    { nombre: "EMPLEADOS", icono: "icon_empleados", seleccionado: false,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"],submenu:[
                                                                                {nombre:"LISTA Y ALTA DE EMPLEADOS",routerLink:['/empleados'],rol:["ALL","ADMINEMPRESA"]},
                                                                                {nombre:"BAJA DE EMPLEADOS",routerLink:['/empleados/bajaempleado'],rol:["ALL","ADMINEMPRESA"]},
                                                                                {nombre:"EMPLEADOS INCOMPLETOS",routerLink:['/empleados/empleadosincompletos'],rol:["ALL","ADMINEMPRESA"]}
                                                                                // {nombre:"DIRECTORIO",routerLink:[],rol:["ALL","ADMINEMPRESA"]}
                                                                              ]},
    { nombre: "EVENTOS", icono: "icon_eventos", seleccionado: false ,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"],routerLink:[],submenu:[
                                                                                {nombre:"EVENTO",routerLink:["/eventos/eventosxempleado"],rol:["ALL","ADMINEMPRESA"]},
                                                                                {nombre:"CALENDARIO",routerLink:["/eventos/calendario"],rol:["ALL","ADMINEMPRESA"]}
    ]},
    { nombre: "IMSS", icono: "icon_imss", seleccionado: false,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"],submenu:[
                                                                                {nombre:"IDSE",routerLink:['imss','idse'],rol:["ALL","ADMINEMPRESA"]},
                                                                                {nombre:"MOVIMIENTOS",routerLink:[],rol:["ALL","ADMINEMPRESA"]},
                                                                                {nombre:"VARIABILIDAD",routerLink:[],rol:["ALL","ADMINEMPRESA"]}] },
    { nombre: "REPORTES", icono: "icon_reportes", seleccionado: false,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"],routerLink:[] },
    { nombre: "MI PERFIL", icono: "icon_perfil", seleccionado: false ,seleccionadosubmenu:false,rol:["ALL","ADMINEMPRESA"],routerLink:[]},
    { nombre: 'CONFIGURACIÓN', icono: "icon_admoncos", seleccionado: false ,seleccionadosubmenu:false,rol:["ALL","ADMINCOMPANIA"],submenu:[
                                                                                {nombre:"COMPAÑIA",routerLink:['/company'],rol:["ALL","ADMINCOMPANIA"]},
                                                                                {nombre:"USUARIOS",routerLink:['/usuarios'],rol:["ALL","ADMINCOMPANIA"]},
                                                                              ]},
    { nombre: "ADMINISTRACIÓN", icono: "icon_admon", seleccionado: false ,seleccionadosubmenu:false,rol:["ALL","ADMINCOMPANIA","ADMINEMPRESA"],submenu:[
                                                                                {nombre:"CONFIGURACIÓN EMPRESA",routerLink:['/listaempresas'],rol:["ALL","ADMINCOMPANIA","ADMINEMPRESA"]},
                                                                                {nombre:"EMPRESA",routerLink:['listaempresas', 'empresas', this.tipoinsert],rol:["ALL","ADMINCOMPANIA"]},
                                                                              ]},
  ];

  constructor() { }


  public getMenu():Array<menuprincipal>{
    return this.arreglo;
  }
}




