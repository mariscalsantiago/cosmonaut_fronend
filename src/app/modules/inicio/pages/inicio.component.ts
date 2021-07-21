import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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
  public eventos: any;

  constructor(public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
  
  }

  public verdetalle(obj:any){
    
  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "fecha":
        //this.calcularFechasEventos(obj.datos);
        break;
    }

  }

}
