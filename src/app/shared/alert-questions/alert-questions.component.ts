import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-alert-questions',
  templateUrl: './alert-questions.component.html',
  styleUrls: ['./alert-questions.component.scss']
})
export class AlertQuestionsComponent implements OnInit {

  public scrollTop:any;
  public content:any;

  @Output() eventoFunciones = new EventEmitter();



  constructor() {

    this.content = document.getElementById("contenido");
    this.scrollTop = this.content.scrollTop;


    this.content.style.overflow = "hidden";

   }



  ngOnInit(): void {

    

  }


  public cancelar(){
    this.content.style.overflow = "auto";
    this.eventoFunciones.emit(false);
  }

  public aceptar(){
    this.content.style.overflow = "auto";
    this.eventoFunciones.emit(true);
  }

}
