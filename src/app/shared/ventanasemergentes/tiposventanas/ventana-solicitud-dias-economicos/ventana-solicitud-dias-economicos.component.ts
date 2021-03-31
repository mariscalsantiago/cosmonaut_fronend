import { Component, OnInit,EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-ventana-solicitud-dias-economicos',
  templateUrl: './ventana-solicitud-dias-economicos.component.html',
  styleUrls: ['./ventana-solicitud-dias-economicos.component.scss']
})
export class VentanaSolicitudDiasEconomicosComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

}
