import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  constructor(private modalPrd:ModalService) { }

  ngOnInit(): void {
  }


  public alerta(){

    this.modalPrd.showMessageDialog(this.modalPrd.loading);


    setTimeout(() => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    }, 3000);

  }


}
