import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ventana-solicitud-carga-masiva-eventos',
  templateUrl: './ventana-solicitud-carga-masiva-eventos.component.html',
  styleUrls: ['./ventana-solicitud-carga-masiva-eventos.component.scss']
})
export class VentanaSolicitudCargaMasivaEventosComponent implements OnInit {

  @Input() public left:string = "0px";

  constructor() { }

  ngOnInit(): void {
  }

}
