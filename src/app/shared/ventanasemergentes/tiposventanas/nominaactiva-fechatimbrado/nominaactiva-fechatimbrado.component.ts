import { Component, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nominaactiva-fechatimbrado',
  templateUrl: './nominaactiva-fechatimbrado.component.html',
  styleUrls: ['./nominaactiva-fechatimbrado.component.scss']
})
export class NominaactivaFechatimbradoComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  public cancelar(){
   this.salida.emit({type:"cancelar"});
  }

  public aceptar(){
    this.salida.emit({type:"guardar",datos:true});
  }

}
