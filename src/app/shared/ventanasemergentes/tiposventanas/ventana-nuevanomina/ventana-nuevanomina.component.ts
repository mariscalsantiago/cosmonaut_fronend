import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-ventana-nuevanomina',
  templateUrl: './ventana-nuevanomina.component.html',
  styleUrls: ['./ventana-nuevanomina.component.scss']
})
export class VentanaNuevanominaComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  constructor(private modalPrd:ModalService) { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  public guardar(){
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas registrar la nómina?").then(valor =>{
        if(valor){
          this.salida.emit({type:"guardar",datos:valor});
        }
      });
  }

}
