import { Component, ElementRef, Input, OnInit, Output, ViewChild,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @ViewChild("inputprincipal") elemento!:ElementRef;
  @Output() salida = new EventEmitter();

  @Input() datos:any = [];

  @Input() llave:string = "";

  @Input()
  public arregloEtiquetas:any = [];


  public elementoSeleccionado:string = "";
  public errorSeleccionado:boolean = false;

  constructor() { }

  ngOnInit(): void {

    console.log(this.datos,"desde el tag");
  }

  public seleccionado(){
      this.elemento.nativeElement.focus();
  }

  public cerrarTag(indice:number){
      this.arregloEtiquetas.splice(indice,1);
      this.salida.emit(this.arregloEtiquetas);
  }

  public evento(evento:any){

    this.errorSeleccionado = false;

    if (evento.which==13) {

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

       
      }

      
      this.salida.emit(this.arregloEtiquetas);
      evento.preventDefault()
    };
  }


  

}