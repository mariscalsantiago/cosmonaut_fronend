import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-ventana-subirdocumento',
  templateUrl: './ventana-subirdocumento.component.html',
  styleUrls: ['./ventana-subirdocumento.component.scss']
})
export class VentanaSubirDocumentoComponent implements OnInit {

  @ViewChild("documento") public inputcer!: ElementRef;

  public nomDocumento: boolean = false;

  @Output() salida = new EventEmitter<any>();
  constructor(private modalPrd:ModalService) { }

  ngOnInit(): void {
    debugger;
  }

  public validarTipoDocumento(idDocumento:any){
    debugger;
    if(idDocumento=='6'){

      this.nomDocumento = true;
    }else{
      this.nomDocumento = false;
    }
  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }
  
  public abrirDoc() {

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg" || ".pdf" || ".txt";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputcer.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          //this.myform.controls.cer.setValue(this.arrayBufferToBase64(datos));
          //console.log("CER", this.arrayBufferToBase64(datos))
        });


      }
    }
  }


  public guardar(){
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas registrar la nómina?").then(valor =>{
        if(valor){
          this.salida.emit({type:"guardar",datos:valor});
        }
      });
  }

}
