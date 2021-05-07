import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';

@Component({
  selector: 'app-ventana-subirdocumento',
  templateUrl: './ventana-subirdocumento.component.html',
  styleUrls: ['./ventana-subirdocumento.component.scss']
})
export class VentanaSubirDocumentoComponent implements OnInit {

  public myForm!: FormGroup;
  public esInsert: boolean = false;
  public nomDocumento: boolean = false;
  public arregloDocumentos: any = [];
  public empresa: number = 0;
  public empleado: number = 0;
  public objEnviar: any = [];

  @Input() public datos:any;
  @ViewChild("documento") public inputdoc!: ElementRef;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private documentosPrd: DocumentosService) 
  { }

  ngOnInit(): void {
    debugger;

    if(this.datos.esInsert){
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
    
    }else{

      this.empresa = this.datos.centrocClienteId;
      this.empleado = this.datos.personaId;
    }


      this.documentosPrd.getDocumentosEmpleado().subscribe(datos =>{
        this.arregloDocumentos = datos.datos;
      console.log("Documentos",this.arregloDocumentos);
    });

    this.myForm = this.createForm(this.datos);
  }


  public createForm(obj: any) {
    debugger;

    return this.formBuild.group({

      idTipoDocumento: [obj.tipoDocumentoId],
      nombre: [obj.nombre],
      documento:[obj.documento]

    });

  }

  public validarTipoDocumento(idDocumento:any){
    
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
    debugger;

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf" || ".txt";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputdoc.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.nombre.setValue(this.inputdoc.nativeElement.value);
          this.myForm.controls.documento.setValue(this.arrayBufferToBase64(datos));
        });


      }
    }
  }

  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public enviarPeticion(){
    
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    let mensaje = this.datos.esInsert? "¿Deseas guardar el documento" : "¿Deseas actualizar el documento?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      
        if(valor){
          
          let  obj = this.myForm.getRawValue();
          
          if(this.datos.esInsert){
            this.objEnviar = {
            centrocClienteId: this.empresa,
            personaId: this.empleado,
            usuarioId: this.empleado,
            tipoDocumentoId: obj.idTipoDocumento,
            nombreArchivo: obj.nombre,
            documento: obj.documento
            };
                  
        }else{

            this.objEnviar = {
            //cmsArchivoId: this.datos.cmsArchivoId,
            //centrocClienteId: this.empresa,
            //personaId: this.empleado,
            //usuarioId: this.empleado,
            documentosEmpleadoId: obj.idTipoDocumento,
            //nombreArchivo: obj.nombre,
            documento: obj.documento
            };

        }
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }


}
