import { Component, ElementRef, OnInit, ViewChild , Input, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { EmpleadosService } from '../../services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { truncate } from 'fs';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  public myForm!: FormGroup;
  public arreglo: any = [];
  public insertar: boolean = false;

  public cargando: Boolean = false;
  public submitEnviado: boolean = false;
  public cargandoIcon: boolean = false;
  public idEmpresa: number = 0;
  public fileName: string = "";
  
  public obj: any = [];

  @Input() public datos:any;
  @ViewChild("documento") public inputdoc!: ElementRef;
  @Output() salida = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder, private routerActivePrd: ActivatedRoute, private reportesPrd: ReportesService,
    private routerPrd: Router,private modalPrd:ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private catalogosPrd:CatalogosService, private EmpleadosService:EmpleadosService) {
  }

  ngOnInit(): void {

    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.obj = history.state.datos == undefined ? {} : history.state.datos;

      

      this.myForm = this.createFormcomp((this.obj));


  }



  public createFormcomp(obj: any) {
    
    return this.formBuilder.group({

      documento: [obj.documento],
      nombre: [obj.nombre],
      tipoCargaId: [obj.tipoCargaId, [Validators.required]]

    });
  }

  public iniciarDescarga(){
    debugger;
    let obj = this.myForm.value;
    if(obj.tipoCargaId == '0' || obj.tipoCargaId == undefined){
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Debe seleccionar un formato a cargar");
    }else{

        debugger;
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

          let objEnviar : any = {
            
              idEmpresa: this.idEmpresa,
              tipoCargaId: obj.tipoCargaId
            

          }
          
            this.reportesPrd.getTipoFormatoEmpleado(objEnviar).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              if(obj.tipoCargaId == 1){
                this.fileName = `${"Formato carga masiva Empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 2){
                this.fileName = `${"Formato carga masiva Ex-empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 3){
                this.fileName = `${"Formato carga masiva Empleados con pago complementario"}.xlsx`;
              }
      
              downloadLink.href = linkSource;
              downloadLink.download = this.fileName;
              downloadLink.click();
            });

    }

  }

  public abrirDoc() {
    debugger;
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";

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

  public enviarPeticion() {
    debugger;
    
      if (this.myForm.invalid) {
        Object.values(this.myForm.controls).forEach(control => {
          control.markAsTouched();
        });
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
  
      }
  
      let mensaje = "¿Deseas realizar esta carga masiva de empleados?";
      
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        
          if(valor){
            
            let  obj = this.myForm.getRawValue();

              let objEnviar : any = {
                centrocClienteId: this.idEmpresa,
                tipoCargaId: obj.tipoCargaId,
                archivo: obj.documento
            };
            this.modalPrd.showMessageDialog(this.modalPrd.loading);

             
    
              this.EmpleadosService.saveCargaMasiva(objEnviar).subscribe(datos => {
    
                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
                  .then(()=> {
                     if (!datos.resultado) {

                      this.EmpleadosService.getListaErroresCargaMasiva(this.idEmpresa).subscribe(datos => {
                      this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
                      .then(()=> {
                      });
                    });
                  }   
                  });
              });     

          }
        });

  }

  public cancelarcomp() {
    this.routerPrd.navigate(['/empleados']);
  }

  get f() { return this.myForm.controls; }


}
