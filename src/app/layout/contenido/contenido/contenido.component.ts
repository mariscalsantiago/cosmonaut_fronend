import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo: Array<menuprincipal> = [
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
    { nombre: "CONFIGURACIÓN", icono: "icon_perfil", seleccionado: false ,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"COMPAÑIA",routerLink:['/compania']},
                                                                                {nombre:"USUARIOS",routerLink:['/usuarios']},
                                                                              ]}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public limpiando(){
    for (let item of this.arreglo)
      item.seleccionado = false;
  }

  public seleccionado(obj: any) {
    this.limpiando();

    obj.seleccionado = true;

    obj.seleccionadosubmenu = !obj.seleccionadosubmenu;
  }


  public seleccionarSubmenu(obj:any,obj2:any)  {
    this.limpiando();
    obj.seleccionado = true;

    
  }

}


interface menuprincipal {
  nombre: string;
  icono: string;
  seleccionado: boolean,
  seleccionadosubmenu:boolean,
  submenu?: Array<submenu>,
  routerLink?:Array<any>
}

interface submenu {
  nombre: string;
  routerLink:Array<any>
}
