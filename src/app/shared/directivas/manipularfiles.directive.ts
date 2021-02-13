import { Directive ,HostListener, Output,EventEmitter} from '@angular/core';


@Directive({
  selector: '[appManipularfiles]'
})
export class ManipularfilesDirective {

  @Output() fromManipularFiles= new EventEmitter();

  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.fromManipularFiles.emit({tipo:"seleccionado",valor:true});
    this.configuracionnoaparecerventana( event );
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.fromManipularFiles.emit({tipo:"seleccionado",valor:false});
  }

  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {

    const transferencia = this._getTransferencia( event );

    if ( !transferencia ) {
      return;
    }

    
    for(let item in Object.getOwnPropertyNames(transferencia.files)){

      let archivo:File = transferencia.files[item];
      if(this.esImagen(archivo.type)){

        
        this.fromManipularFiles.emit({tipo:"imagen",valor:archivo});

      }else{

        

        this.fromManipularFiles.emit({tipo:"errorimagen",valor:"La archivo seleccionado no es una imagen"});

      }
        

    }
    this.configuracionnoaparecerventana( event );
    console.log(false);

  }

  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }


  private configuracionnoaparecerventana( event:any ) {
    event.preventDefault();
    event.stopPropagation();
  }



  private esImagen( tipoArchivo: string ): boolean {
    return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

}
