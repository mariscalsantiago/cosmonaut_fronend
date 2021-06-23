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
  


  public elementoSeleccionado:string = "";
  public errorSeleccionado:boolean = false;

  constructor() { }

  ngOnInit(): void {

    
  }

  public  ngOnChanges(changes: SimpleChanges): void{

    if(this.calendario){
        if(this.dias == undefined || this.dias == ""){
          this.arregloEtiquetas = [];
        }
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
      if (evento.which==13 ) {
        this.eventoSeleccionando();
      
        evento.preventDefault()
      }else if(evento.which == undefined){
          setTimeout(() => {
              this.eventoSeleccionando();
          }, 20);
      }  
  }

  public eventoSeleccionando(){

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

      if(this.arregloEtiquetas.length >= Number(this.dias)){
          return;
      }
      this.arregloEtiquetas.push(this.elementoSeleccionado);
      this.elementoSeleccionado = "";
      this.salida.emit(this.arregloEtiquetas);
      
    }

   
  }



  

}
