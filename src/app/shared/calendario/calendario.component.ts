import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {


  @Input() public arregloEventos:any = [];
  @Input() public arregloAreas:any = [];

  public fecha!: Date;

  public arregloArreglos: any = [];

  public aparecerModalita:boolean = false;

  public top:number = 0;
  public left:number = 0;

  public mesauxActual:boolean = false;


  constructor() { }

  ngOnInit(): void {

    
     
     this.ejecutarMes(new Date());

  }


  public ejecutarMes(fechaParam:Date){
    this.arregloArreglos = [];
    const dateTransform = new DatePipe("es-MX");

    this.fecha = new Date(fechaParam.getFullYear(), fechaParam.getMonth(), 1);
    let dia = dateTransform.transform(fechaParam, "EEEE");
    let diaActual = dateTransform.transform(fechaParam, "dd");

    const mesActual = dateTransform.transform(this.fecha, "MMM");
    this.mesauxActual = dateTransform.transform(new Date(), "MMM") == mesActual;

    let restarDias = 0;

    switch (dia) {
      case "lunes":
        restarDias = 1;
        break;
      case "martes":
        restarDias = 2;
        break;
      case "miercoles":
        restarDias = 3;
        break;
      case "jueves":
        restarDias = 4;
        break;
      case "viernes":
        restarDias = 5;
        break;
      case "sabado":
        restarDias = 6;
        break;
    }

    let totalDias = 1-restarDias;
    


    
    for (let x = 0; x <= 5; x++) {
      this.arregloArreglos.push([]);
        for(let y = 1; y <= 7; y++){
            let fechaAux = new Date(fechaParam.getFullYear(), fechaParam.getMonth(), totalDias);
            let dia = dateTransform.transform(fechaAux,"dd");
            const mesAux =  dateTransform.transform(fechaAux,"MMM");
            let obj:any = {
              dia:dia,
              mesActual:mesAux == mesActual,
              diaActual:dia  == diaActual,
              eventos:[],
              aparecerModal:false
            }

            if(Number(dia) == 16){
                obj.eventos.push({nombre:"aniversario"});
                obj.eventos.push({nombre:"cumpleaños"});
                obj.eventos.push({nombre:"faltas"});
            }
            if(Number(dia) == 16){
              obj.eventos.push({nombre:"diaseconomicos"});
          }
          if(Number(dia) == 13){
            obj.eventos.push({nombre:"vacaciones"});
        }
        if(Number(dia) == 25){
          obj.eventos.push({nombre:"horasextras"});
          obj.eventos.push({nombre:"incapacidades"});
      }

            this.arregloArreglos[x].push(obj);
            totalDias++;    
        }
        
    }

  }


  public aparecerModalEvento(evento:any,mouse:any){
      const nombre = evento.nombre;
      
      
      this.aparecerModalita = true;

      this.top = mouse.pageY -200;
      this.left = mouse.pageX -200;
  }

  public anteriorMes(){

    let fechaEnviar:Date = new Date(this.fecha.getFullYear(),this.fecha.getMonth()-1,this.fecha.getDate());

    const dateTransform = new DatePipe("es-MX");
    const mesActual = dateTransform.transform(new Date(), "MMM");
    const mesFechaEnviar = dateTransform.transform(fechaEnviar,"MMM");
    

    fechaEnviar = new Date(fechaEnviar.getFullYear(),fechaEnviar.getMonth(),(mesActual == mesFechaEnviar)?new Date().getDate():fechaEnviar.getDate());
  
     this.ejecutarMes(fechaEnviar);

  }

  public siguienteMes(){
    let fechaEnviar = new Date(this.fecha.getFullYear(),this.fecha.getMonth()+1,this.fecha.getDate());
    const dateTransform = new DatePipe("es-MX");
    const mesActual = dateTransform.transform(new Date(), "MMM");
    const mesFechaEnviar = dateTransform.transform(fechaEnviar,"MMM");
    fechaEnviar = new Date(fechaEnviar.getFullYear(),fechaEnviar.getMonth(),(mesActual == mesFechaEnviar)?new Date().getDate():fechaEnviar.getDate());
    this.ejecutarMes(fechaEnviar);
  }



}
