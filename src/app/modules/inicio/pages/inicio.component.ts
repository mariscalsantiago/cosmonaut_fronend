import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public valor:any;

  constructor(private modalPrd:ModalService,private ventana:VentanaemergenteService) { }

  ngOnInit(): void {
  }


  public alerta(){

      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      setTimeout(() => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      }, 3000);

  }


  public cambiaValor(elemento:any){


    console.log(elemento.value);

    switch(Number(elemento.value)){
      case 1:
        this.ventana.showVentana(this.ventana.solicitudCargaMasiva);
        break;
        case 2:
          this.ventana.showVentana(this.ventana.solicitudVacaciones);
        break;
        case 3:
          this.ventana.showVentana(this.ventana.solicitudIncapacidad);
        break;
        case 4:
          this.ventana.showVentana(this.ventana.solicitudHorasExtras);
        break;
        case 5:
          this.ventana.showVentana(this.ventana.solicitudDiasEconomicos);
          break;
    }
  }


}
