import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { menuprincipal,submenu } from '../../../core/data/estructuramenu';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo!: Array<menuprincipal>;
  public mostrarmenu:boolean = false;

  

  public modal = {
     strTitulo: "",
     iconType : "",
     modal : false
  }



  constructor(private menuPrd:MenuService,private modalPrd:ModalService) {
    this.modalPrd.setModal(this.modal);
   }

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


  public recibir(obj:any){

    this.modalPrd.recibiendomensajes(obj);

  }

  public mostrarVentana(){
    this.modalPrd.showMessageDialog(this.modalPrd.success).then();
  }

  

}



