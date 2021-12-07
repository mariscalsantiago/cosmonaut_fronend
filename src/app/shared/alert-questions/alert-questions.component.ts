import { Component, OnInit, Output,EventEmitter, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { ConfiguracionesService } from '../services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-alert-questions',
  templateUrl: './alert-questions.component.html',
  styleUrls: ['./alert-questions.component.scss']
})
export class AlertQuestionsComponent implements OnInit,OnChanges {

  public scrollTop:any;
  public content:any;

  @Output() eventoFunciones = new EventEmitter();
  @Input() titulo:string = "";
  @Input() iconType:string="";
  @Input() subtitulo:string = "";





  ngOnChanges(changes: SimpleChanges): void{

    if(this.iconType == "success"){
        setTimeout(() => {
          this.aceptar();
        }, 2000);
    }

  }



  constructor(private configuracion:ConfiguracionesService) {

    this.content = document.getElementById("contenido");
    this.scrollTop = this.content.scrollTop;
    this.content.style.overflow = "hidden";
   }



  ngOnInit(): void {

  }

  


  public cancelar(){
    debugger;
    this.content.style.overflow = "auto";
    this.eventoFunciones.emit(false);
  }

  public aceptar(){
    this.content.style.overflow = "auto";
    this.eventoFunciones.emit(true);
  }


  public getCantidad(){
    return this.configuracion.getCantidadDispersion();
    }

}
