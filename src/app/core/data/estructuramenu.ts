export interface menuprincipal {
    nombre: string;
    icono: string;
    seleccionado: boolean,
    seleccionadosubmenu:boolean,
    submenu?: Array<submenu>,
    routerLink?:Array<any>,
    rol?:Array<String>
  }
  
  export interface submenu {
    nombre: string;
    routerLink:Array<any>,
    rol?:Array<String>
  }