import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Output, ViewChild,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit,OnChanges {

  @ViewChild("inputprincipal") elemento!:ElementRef;
  @Output() salida = new EventEmitter();

  @Input() datos:any = [];

  @Input() llave:string = "";

  @Input()
  public arregloEtiquetas:any = [];


  @Input()
  public calendario:boolean = false;

  @Input()
  public dias:string = "";

  @Input()
  public dominical:boolean = false;
  


  public elementoSeleccionado:string = "";
  public errorSeleccionado:boolean = false;
  public noChange:boolean = false;

  constructor() { }

  ngOnInit(): void {
    
    
  }

  public  ngOnChanges(changes: SimpleChanges): void{
    
    if(this.calendario){
      
/*         if(this.dias == undefined || this.dias == ""){
          this.arregloEtiquetas = [];
        } */
        this.arregloEtiquetas = [];
    }
  }

  public seleccionado(){
      if(!this.calendario){
        this.elemento.nativeElement.focus();
      }
  }

  public cerrarTag(indice:number){
      this.arregloEtiquetas.splice(indice,1);
      this.salida.emit(this.arregloEtiquetas);
  }

  public evento(evento:any){
    this.errorSeleccionado = false;
    console.log(evento.which);
      if (evento.which==13 || evento.which==9) {
        this.eventoSeleccionando();

        if(evento.which!==9){
          evento.preventDefault()
        }
        
      }else if(evento.which == undefined){
          setTimeout(() => {
              this.eventoSeleccionando();
          }, 20);
      }  

      if (evento.which!==13) {
         this.noChange = true;
         setTimeout(() => {
           this.noChange = false;
         }, 50);
      }
  }

  public eventoSeleccionando(){
    if(this.noChange) {
      this.noChange = false;
      return
    };

    if(!this.calendario){
      if(this.elementoSeleccionado.trim() !== ""){

        let encontrado:boolean = false;
        let elementoencontrado;
        for(let item of this.datos){
            if(item[this.llave].trim() == this.elementoSeleccionado.trim()){
              encontrado = true;
              elementoencontrado = item;
                  break;
            }
        }
        if(encontrado){
          let repetido:boolean = false;
          for(let item of this.arregloEtiquetas){
            if(item[this.llave].trim() == this.elementoSeleccionado.trim()){
              repetido = true;
                  break;
            }
          }
        if(!repetido)   this.arregloEtiquetas.push(elementoencontrado);
          this.elementoSeleccionado = "";
        }else{
          this.errorSeleccionado = true;
        }
        this.salida.emit(this.arregloEtiquetas);
      }
    }else{
      if(!Boolean(this.elementoSeleccionado)) return;

      if(this.dominical){
        let fecha = new Date(this.elementoSeleccionado)
        if(fecha.getUTCDay() !== 0){
            this.salida.emit({type:"error",datos:true});
            return;
        }
      }
      if(this.arregloEtiquetas.length >= Number(this.dias)){
          return;
      }
      let encontrado:boolean = this.arregloEtiquetas.some((o:any)=> o == this.elementoSeleccionado)
      if(encontrado){
        this.elementoSeleccionado = "";
        return;
      };
      this.arregloEtiquetas.push(this.elementoSeleccionado);
      this.salida.emit(this.arregloEtiquetas);
      this.elementoSeleccionado = "";
    }

   
  }



  

}
