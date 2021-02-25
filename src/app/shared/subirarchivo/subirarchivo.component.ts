import { Component, OnInit,EventEmitter, Output, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-subirarchivo',
  templateUrl: './subirarchivo.component.html',
  styleUrls: ['./subirarchivo.component.scss']
})
export class SubirarchivoComponent implements OnInit {

  @Output() emiteimagen = new EventEmitter();

  public errorimagen:boolean = false;
  public seleccionado:boolean = false;
  public imagen!:File;
  public buffer:any ;

  @Input() public externo!:string;

  constructor(private sanitizer:DomSanitizer) { }
  sanitize( url:string ) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit(): void {
  }


  public recibir(obj:any){

    console.log(obj.tipo);

    switch(obj.tipo){
      case "seleccionado":
           this.seleccionado = obj.valor;
           this.errorimagen = false;
           break;
      case "errorimagen":


        this.seleccionado = false;
        this.errorimagen = true;

        break;
      case "imagen":
        this.imagen = obj.valor;
        this.seleccionado = false;
        this.errorimagen = false;

        this.imagen.arrayBuffer().then(datos =>{
          this.buffer = datos;
          this.emiteimagen.emit(this.arrayBufferToBase64(datos));
        });
        
        break;
    }
  }


  public arrayBufferToBase64( buffer:any ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }


  public tamanio(){
    let numero = this.imagen.size / 1000;
    return numero;
  }


  public eliminarImagen(){
    this.emiteimagen.emit(undefined);
    this.errorimagen = false;
    this.seleccionado = false;
    
    this.buffer = undefined;
  }


  public abrirArchivo(){

    let elemento:any = document.createElement("input");
    elemento.type = "file";
    elemento.click();
    elemento.onchange = ()=>{
      for(let item in Object.getOwnPropertyNames(elemento.files)){

        let archivo:File = elemento.files[item];

        if(this.esImagen(archivo.type)){        
          this.recibir({tipo:"imagen",valor:archivo});
        }else{ 
          this.recibir({tipo:"errorimagen",valor:"La archivo seleccionado no es una imagen"});
        }
          
  
      }
    }
    

  }

  private esImagen( tipoArchivo: string ): boolean {
    return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

}
