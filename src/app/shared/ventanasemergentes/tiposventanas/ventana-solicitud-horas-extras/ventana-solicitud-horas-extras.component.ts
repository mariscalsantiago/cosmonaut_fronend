import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ventana-solicitud-horas-extras',
  templateUrl: './ventana-solicitud-horas-extras.component.html',
  styleUrls: ['./ventana-solicitud-horas-extras.component.scss']
})
export class VentanaSolicitudHorasExtrasComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


}
