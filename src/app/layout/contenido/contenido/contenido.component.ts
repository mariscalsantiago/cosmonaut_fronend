import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { menuprincipal,submenu } from '../../../core/data/estructuramenu';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {
  public arreglo!:Array<menuprincipal>;

  constructor(private router:Router,private menuPrd:MenuService) { 

       this.arreglo = menuPrd.getMenu();

  }

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


  public seleccionarSubmenu(obj:any,obj2:submenu)  {

    this.router.navigate(obj2.routerLink);  
    
     

    
    
  }

}


