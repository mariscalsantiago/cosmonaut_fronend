import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-ventana-solicitud-vacaciones',
  templateUrl: './ventana-solicitud-vacaciones.component.html',
  styleUrls: ['./ventana-solicitud-vacaciones.component.scss']
})
export class VentanaSolicitudVacacionesComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

}
