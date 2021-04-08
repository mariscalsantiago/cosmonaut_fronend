import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public valor: any;

  constructor(private modalPrd: ModalService, private ventana: VentanaemergenteService) { }

  ngOnInit(): void {
  }


  public alerta() {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    setTimeout(() => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    }, 3000);

  }


  


}
