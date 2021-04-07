import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ventana-nuevanomina',
  templateUrl: './ventana-nuevanomina.component.html',
  styleUrls: ['./ventana-nuevanomina.component.scss']
})
export class VentanaNuevanominaComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

}
