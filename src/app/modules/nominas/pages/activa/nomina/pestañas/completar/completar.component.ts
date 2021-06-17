import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-completar',
  templateUrl: './completar.component.html',
  styleUrls: ['./completar.component.scss']
})
export class CompletarComponent implements OnInit {

  @Input() esDescargar:boolean = false;

  public cargandoIcon:boolean = false;
  constructor(private modalPrd:ModalService) { }

  ngOnInit(): void {
  }


  public cancelarTimbrado(){
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas cancelar el timbrado de nómina?").then((valor)=>{
        if(valor){

        }
      });;
  }

  public enviarRecibos(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas enviar los recibos de pago a los empleados?").then((valor)=>{
      if(valor){

      }
    });;
}

}
