import { Component, OnInit, Output,EventEmitter, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-alert-questions',
  templateUrl: './alert-questions.component.html',
  styleUrls: ['./alert-questions.component.scss']
})
export class AlertQuestionsComponent implements OnInit {

  public scrollTop:any;
  public content:any;

  @Output() eventoFunciones = new EventEmitter();
  @Input() titulo:string = "";
  @Input() iconType:string="";
  @Input() subtitulo:string = "";

  public tamanio:number = 0;
  public leftP:number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
    this.leftP = (this.tamanio / 2)-150;

    console.log(this.leftP);
  }



  constructor() {

    this.content = document.getElementById("contenido");
    this.scrollTop = this.content.scrollTop;


    this.content.style.overflow = "hidden";

   }



  ngOnInit(): void {
    let documento:any = document.defaultView;
    this.tamanio = documento.innerWidth;


    this.leftP = (this.tamanio / 2)-150;

    

    console.log(this.leftP);
    console.log("left de la vetnana");

    

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
