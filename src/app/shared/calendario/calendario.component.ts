import { DatePipe } from '@angular/common';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit, OnChanges {


  @Input() public arregloEventos: any = [];
  @Input() public arregloAreas: any = [];

  @Input() public eventos: any = [];

  @Output() public salida = new EventEmitter();



  public fecha!: Date;

  public arregloArreglos: any = [];

  public aparecerModalita: boolean = false;

  public top: number = 0;
  public left: number = 0;

  public mesauxActual: boolean = false;


  public eventoActual:any = {color:"yellow"};


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    let arregloResagado = [];
    let primerapasada:boolean = false;
    
   let datepipe = new DatePipe("es-MX");
    for (let x = 0; x <= 5; x++) {
      for (let y = 0; y <= 6; y++) {
        this.arregloArreglos[x][y].eventos = [];
        if (this.eventos !== undefined) {
          for (let item of this.eventos) {
            let fechaEvento: Date = new Date(item.fechaInicio);

            let mes = datepipe.transform(fechaEvento,"MM");
            
            if (fechaEvento.getDate() == Number(this.arregloArreglos[x][y].dia) && mes == this.arregloArreglos[x][y].mes) {
              
              let inicio:Date = new Date(item.fechaInicio);
              let fin:Date = new Date(item.fechaFin);
             // let diascalendario = (fin.getTime()-inicio.getTime())/(1000 * 3600 * 24);
              let diascalendario = 4;
              
              this.arregloArreglos[x][y].eventos.push({
                ...item,
                nombre: `${item.nombre} ${item.apellidoPaterno}`,
                diascalendario: diascalendario

              });

              // if(diascalendario !== 0){
              //   arregloResagado.push({
              //     ...item,
              //     nombre: `${item.nombre} ${item.apellidoPaterno}`,
              //     diascalendario: diascalendario,
              //     inicio:true
              //     });
              // }
            }            
          }
        }

        // for(let itemR of arregloResagado){
        //     itemR.diascalendario -= itemR.diascalendario;
            
        //     this.arregloArreglos[x][y].eventos.push({
        //       ...itemR,
        //       nombre: ``
        //     });
        // }

        
      }
    }

    console.log("Este es el arreglo resagado",this.arregloArreglos);
  }

  ngOnInit(): void {



    this.ejecutarMes(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    this.salida.emit({type:"fecha",datos:new Date(new Date().getFullYear(), new Date().getMonth(), 1)});

  }


  public ejecutarMes(fechaParam: Date) {
    
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
      case "sábado":
        restarDias = 6;
        break;
    }


    let totalDias = 1 - restarDias;




    const fechanow: Date = new Date();

    const diaauxnow = dateTransform.transform(fechanow, "dd");
    const mesauxnow = dateTransform.transform(fechanow, "MMM");

    for (let x = 0; x <= 5; x++) {
      this.arregloArreglos.push([]);
      for (let y = 1; y <= 7; y++) {
        let fechaAux = new Date(fechaParam.getFullYear(), fechaParam.getMonth(), totalDias);

        let dia = dateTransform.transform(fechaAux, "dd");
        const mesAux = dateTransform.transform(fechaAux, "MMM");

        
        let obj: any = {
          dia: dia,
          mesActual: mesAux == mesActual,
          mes:dateTransform.transform(fechaAux,"MM"),
          diaActual: dia == diaActual,
          eventos: [],
          aparecerModal: false,
          esDiaNow: (diaauxnow == dia && mesAux == mesauxnow)
        }



        // if (Number(dia) == 16) {
        //   obj.eventos.push({ nombre: "aniversario" });
        //   obj.eventos.push({ nombre: "cumpleaños" });
        //   obj.eventos.push({ nombre: "faltas" });
        // }
        // if (Number(dia) == 16) {
        //   obj.eventos.push({ nombre: "diaseconomicos" });
        // }
        // if (Number(dia) == 13) {
        //   obj.eventos.push({ nombre: "vacaciones" });
        // }
        // if (Number(dia) == 25) {
        //   obj.eventos.push({ nombre: "horasextras" });
        //   obj.eventos.push({ nombre: "incapacidades" });
        // }

        this.arregloArreglos[x].push(obj);
        totalDias++;
      }

    }

  }


  public aparecerModalEvento(evento: any, mouse: any) {
    this.eventoActual = evento;


    this.aparecerModalita = true;

    this.top = mouse.pageY - 200;
    this.left = mouse.pageX - 200;
    

   
    switch(evento.tipoIncidenciaId){
      case 8:
        this.eventoActual.color = "#67bf89";
        break;
      case 5:
        this.eventoActual.color = "#7973ba";
        break;
      case 2:
        this.eventoActual.color = "#5db2c9";
        break;
      case 1:
        this.eventoActual.color = "#67bf89";
        break;
      case 13:
      case 14:
        this.eventoActual.color = "#deaa57";
        break;
      case 3:
        this.eventoActual.color = "#e17b5b";
        break;
      default:
        this.eventoActual.color = "#a31616";
    }

    
  }

  public anteriorMes() {

    let fechaEnviar: Date = new Date(this.fecha.getFullYear(), this.fecha.getMonth() - 1, 1);

    this.salida.emit({type:"fecha",datos:fechaEnviar});

    this.ejecutarMes(fechaEnviar);

  }

  public siguienteMes() {
    let fechaEnviar = new Date(this.fecha.getFullYear(), this.fecha.getMonth() + 1, 1);
    this.salida.emit({type:"fecha",datos:fechaEnviar});
    this.ejecutarMes(fechaEnviar);
  }



}
