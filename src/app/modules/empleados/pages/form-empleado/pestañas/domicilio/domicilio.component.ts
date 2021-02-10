import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent implements OnInit {

  @Output() enviado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


 
  public guardar(){
    this.enviado.emit({type:"domicilio",valor:true});
  }
  public cancelar(){
    
  }

}
