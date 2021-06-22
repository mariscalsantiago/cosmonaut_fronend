import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public valor: any;

  constructor(private modalPrd: ModalService, private ventana: VentanaemergenteService,private usuariosPrd:UsuarioSistemaService) { }

  ngOnInit(): void {
  
  }


  public alerta() {

  }


  public vermodal(){
    this.ventana.showVentana(this.ventana.timbrado,{ventanaalerta:true});
  }

  public vermodal2(){
    this.ventana.showVentana(this.ventana.timbrado);
  }


  


}
