import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { menuprincipal,submenu } from '../../../core/data/estructuramenu';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo!: Array<menuprincipal>;
  public modal:boolean = false;

  constructor(private menuPrd:MenuService) { }

  ngOnInit(): void {

    this.arreglo = this.menuPrd.getMenu();

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

  public prueba(){
    console.log("samv");
    return false;
  }


}



