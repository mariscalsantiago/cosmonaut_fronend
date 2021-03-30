import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  public fecha!: Date;

  public arregloArreglos: any = [];

  public aparecerModalita:boolean = false;

  public top:number = 0;
  public left:number = 0;

  constructor() { }

  ngOnInit(): void {

    const dateTransform = new DatePipe("es-MX");

    this.fecha = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let dia = dateTransform.transform(this.fecha, "EEEE");
    let diaActual = dateTransform.transform(new Date(), "dd");

    const mesActual = dateTransform.transform(this.fecha, "MMM");

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
    


    
    for (let x = 0; x < 5; x++) {
      this.arregloArreglos.push([]);
        for(let y = 1; y <= 7; y++){
            let fechaAux = new Date(new Date().getFullYear(), new Date().getMonth(), totalDias);
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

    console.log("Estos son los dias",this.arregloArreglos);

  }


  public aparecerModalEvento(evento:any,mouse:any){
      const nombre = evento.nombre;
      
      
      this.aparecerModalita = true;

      this.top = mouse.pageY;
      this.left = mouse.pageX;

;

  }

}
