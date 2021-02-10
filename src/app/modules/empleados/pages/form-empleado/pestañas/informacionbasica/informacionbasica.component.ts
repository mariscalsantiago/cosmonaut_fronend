import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

  @Output() enviado = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


 
  public guardar(){
    this.enviado.emit({type:"informacion",valor:true});
  }


  public cancelar(){
    
  }
}
