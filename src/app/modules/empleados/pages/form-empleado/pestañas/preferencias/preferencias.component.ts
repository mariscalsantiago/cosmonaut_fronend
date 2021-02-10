import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss']
})
export class PreferenciasComponent implements OnInit {

  @Output() enviado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


 
  public guardar(){
    this.enviado.emit({type:"preferencias",valor:true});
  }

  public cancelar(){

  }
}
