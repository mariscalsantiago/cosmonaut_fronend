import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-ventana-resumen-timbrado',
  templateUrl: './ventana-resumen-timbrado.component.html',
  styleUrls: ['./ventana-resumen-timbrado.component.scss']
})
export class VentanaResumenTimbradoComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  constructor(private modalPrd:ModalService) { }

  ngOnInit(): void {
  }



  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  public guardar(){
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas continuar?").then(valor =>{
        if(valor){
          this.salida.emit({type:"guardar",datos:valor});
        }
      });
  }

}