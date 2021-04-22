import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { menuprincipal, submenu } from '../../../core/data/estructuramenu';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo!: Array<menuprincipal>;
  public mostrarmenu: boolean = false;
  public temporal: boolean = false;

  public ocultarchat:boolean = true;



  public modal = {
    strTitulo: "",
    iconType: "",
    modal: false,
    strSubtitulo:""
  }

  public mostrar = {
    nuevanomina:false,
    timbrado:false,
    timbrar:false,
    percepciones: false
  }

  public emergente = {
    modal: false,
    titulo:'',
    ventanaalerta:false
  }

  public rol!: string;



  constructor(private menuPrd: MenuService, private modalPrd: ModalService, private sistemaUsuarioPrd: UsuarioSistemaService,
    private ventana: VentanaemergenteService,private navigate:Router) {
    this.modalPrd.setModal(this.modal);
    this.ventana.setModal(this.emergente, this.mostrar);
  }

  ngOnInit(): void {

    this.rol = this.sistemaUsuarioPrd.getRol();

    this.arreglo = this.menuPrd.getMenu();

  }

  public limpiando() {
    for (let item of this.arreglo)
      item.seleccionado = false;
  }

  public seleccionado(obj: any) {
    this.limpiando();

    obj.seleccionado = true;

    obj.seleccionadosubmenu = !obj.seleccionadosubmenu;
  }


  public seleccionarSubmenu(obj: any, obj2: any) {
    this.limpiando();
    obj.seleccionado = true;


  }


  public recibir(obj: any) {

    this.modalPrd.recibiendomensajes(obj);

  }

  public mostrarVentana() {
    this.modalPrd.showMessageDialog(this.modalPrd.success).then();
  }

  public recibirEmergente($event: any) {
    this.emergente.modal = false;
    this.ventana.recibiendomensajes($event);
  }


  public recibirchat(obj:any){
      switch(obj.type){
          case "exit":
            this.ocultarchat = true;
            break;
      }
  }


  public cerrarSesion(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Estás seguro de cerrar la sesión?").then(valor=>{
      if(valor){
          this.navigate.navigate(["/"]);
      }
    });
  }



}



