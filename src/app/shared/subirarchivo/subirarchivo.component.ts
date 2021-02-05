import { Component, OnInit,EventEmitter, Output } from '@angular/core';
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
        });
        
        break;
    }
  }


  public arrayBufferToBase64( buffer:any ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }

    this.emiteimagen.emit(binary);
    return window.btoa( binary );
  }


  public tamanio(){
    let numero = this.imagen.size / 1000;
    return numero;
  }

}
