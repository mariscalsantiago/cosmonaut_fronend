import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  @Output() enviado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


 
  public guardar(){
    this.enviado.emit({type:"empleo",valor:true});
  }

  public cancelar(){
    
  }
}
