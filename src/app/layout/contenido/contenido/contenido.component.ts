import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo: Array<menuprincipal> = [
    { nombre: "INICIO", icono: "icon_home", seleccionado: true,seleccionadosubmenu:false },
    { nombre: "EMPLEADOS", icono: "icon_nominas", seleccionado: false ,seleccionadosubmenu:false},
    { nombre: "NOMINAS", icono: "icon_empleados", seleccionado: false,seleccionadosubmenu:false,submenu:[
                                                                                {nombre:"COMPLETAR"},
                                                                                {nombre:"LISTA"},
                                                                                {nombre:"DAR DE ALTA"},
                                                                                {nombre:"DAR DE BAJA"},
                                                                                {nombre:"DIRECTORIO"}
                                                                              ] },
    { nombre: "EVENTOS", icono: "icon_eventos", seleccionado: false ,seleccionadosubmenu:false},
    { nombre: "IMSS", icono: "icon_imss", seleccionado: false,seleccionadosubmenu:false },
    { nombre: "REPORTES", icono: "icon_reportes", seleccionado: false,seleccionadosubmenu:false },
    { nombre: "MI PERFIL", icono: "icon_perfil", seleccionado: false ,seleccionadosubmenu:false}
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
  submenu?: Array<submenu>;
}

interface submenu {
  nombre: string;
}
