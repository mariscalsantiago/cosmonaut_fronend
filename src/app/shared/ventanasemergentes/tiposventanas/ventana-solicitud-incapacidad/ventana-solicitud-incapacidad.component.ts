import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ventana-solicitud-incapacidad',
  templateUrl: './ventana-solicitud-incapacidad.component.html',
  styleUrls: ['./ventana-solicitud-incapacidad.component.scss']
})
export class VentanaSolicitudIncapacidadComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public abrirArchivo(){
    
  }

}
