import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  @Output() enviado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


 
  public guardar(){
    this.enviado.emit({type:"detalle",valor:true});
  }


  public cancelar(){

  }

}
