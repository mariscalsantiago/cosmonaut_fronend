import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nominaactiva-timbrar',
  templateUrl: './nominaactiva-timbrar.component.html',
  styleUrls: ['./nominaactiva-timbrar.component.scss']
})
export class NominaactivaTimbrarComponent implements OnInit {

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
