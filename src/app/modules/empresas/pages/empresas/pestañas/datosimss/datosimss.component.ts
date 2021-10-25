import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild , ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImssService } from 'src/app/modules/empresas/services/imss/imss.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';



@Component({
  selector: 'app-datosimss',
  templateUrl: './datosimss.component.html',
  styleUrls: ['./datosimss.component.scss']
})
export class DatosimssComponent implements OnInit {

  @ViewChild("nombre") nombre!: ElementRef;
  @Output() enviado = new EventEmitter();
  @Input() datos: any;
  public show = false;
  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public activadoCer: boolean = false;
  public activadoFiel: boolean = false;
  public cargando: Boolean = false;
  public arregloImss: any = [];
  public objenviar: any = [];
  public insertarMof: boolean = false;
  public resultado: boolean = false;
  public cerCargado: boolean = false;

  constructor(private formBuilder: FormBuilder, private imssPrd: ImssService, private routerPrd: Router,
    private modalPrd: ModalService) { }

  ngOnInit(): void {
    
    this.imssPrd.getAllByImss(this.datos.empresa.centrocClienteId).subscribe(datos => {
      this.arregloImss = datos.datos;
      this.myForm = this.createForm(this.arregloImss);
    });

    this.myForm = this.createForm(this.arregloImss);

  }

  public createForm(obj: any) {

    if (this.arregloImss.credencialesImssId != undefined) {
      this.cerCargado = true;
      obj.cerIMSS = 'Certificado IMSS digital cargado';
      obj.contrasenaCerIMSS = "12345";
      obj.usuarioCerIMSS = "Usuario de certificado IMSS cargado";
    }

    return this.formBuilder.group({
      cerIMSS: [{ value: obj.cerIMSS, disabled: true },[Validators.required]],
      usuarioCerIMSS: [obj.usuarioCerIMSS,[Validators.required]],
      contrasenaCerIMSS: [obj.contrasenaCerIMSS,[Validators.required]],
      registroPatronal: [obj.registroPatronal, [Validators.required, Validators.pattern(/^[A-Za-z,ñ,Ñ,&]/)]],
      emPrimaRiesgo: [obj.emPrimaRiesgo, [Validators.required, Validators.pattern(/[0-9]{1}(\.[1-9])/)]],
      emClaveDelegacionalImss: [obj.emClaveDelegacionalImss, [Validators.required, Validators.pattern(/^\d{2}$/)]],
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar,


    });

  }


  public activcer() {

    this.activadoFiel = false;
    this.activadoCer = true;
  }
  public activfiel() {

    this.activadoFiel = true;
    this.activadoCer = false;
  }


  public validarUsuarioCerIMSS(obj:any){
    
    if(this.cerCargado === true && obj !==  "Usuario de certificado IMSS cargado"){
      if(this.myForm.controls.contrasenaCerIMSS.value ===  "12345"){
      this.myForm.controls.contrasenaCerIMSS.setValue('');
      this.myForm.controls.contrasenaCerIMSS.setValidators([Validators.required]);
      }
      if(this.myForm.controls.cerIMSS.value ===  "Certificado IMSS digital cargado"){
      this.myForm.controls.cerIMSS.setValue('');
      this.myForm.controls.cerIMSS.setValidators([Validators.required]);
      }

    }

  }

  public validarCerIMSS(obj:any){
    
    if(this.cerCargado === true && obj !==  "Certificado IMSS digital cargado"){

      if(this.myForm.controls.contrasenaCerIMSS.value ===  "12345"){
      this.myForm.controls.contrasenaCerIMSS.setValue('');
      this.myForm.controls.contrasenaCerIMSS.setValidators([Validators.required]);
      }
      if(this.myForm.controls.usuarioCerIMSS.value ===  "Usuario de certificado IMSS cargado"){
      this.myForm.controls.usuarioCerIMSS.setValue('');
      this.myForm.controls.usuarioCerIMSS.setValidators([Validators.required]);
      }
    }

  }

  public validarContrasenaCerIMSS(obj:any){
    
    if(this.cerCargado === true && obj !==  "12345"){

      if(this.myForm.controls.usuarioCerIMSS.value ===  "Usuario de certificado IMSS cargado"){
      this.myForm.controls.usuarioCerIMSS.setValue('');
      this.myForm.controls.usuarioCerIMSS.setValidators([Validators.required]);
      }
      if(this.myForm.controls.cerIMSS.value ===  "Certificado IMSS digital cargado"){
      this.myForm.controls.cerIMSS.setValue('');
      this.myForm.controls.cerIMSS.setValidators([Validators.required]);
      }
    }

  }
  public cancelar() {
    this.enviado.emit({type:"cancelar"});

  }

  public abrirCerIMSS() {

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pfx";

    input.click();

    input.onchange = () => {
      
      let imagenInput: any = input.files;
      let extName = imagenInput![0].name;
      let ext = extName.split('.');
      extName = ext[1].toLowerCase();
       if(extName != 'pfx'){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"El archivo cargado no tiene una extensión correcta");
        return;
      } 
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.cerIMSS.setValue(this.arrayBufferToBase64(datos));
          //this.myForm.controls.contrasenia.enable();

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


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }
    let obj = this.myForm.getRawValue();
    if (!Boolean(obj.cerIMSS)) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Archivo de Certificado IMSS .pfx obligatorio");
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, '¿Deseas guardar cambios?').then(valor => {
      if (valor) {
        this.guardar();
      }
    });

  }

  public get f() {
    return this.myForm.controls;
  }


  public guardar() {
    
    this.datos.activarGuardaMod = true;

    let obj = this.myForm.getRawValue();
    if (obj.cerIMSS == 'Certificado IMSS digital cargado') {
      obj.cerIMSS = null;
      
    }
    if(obj.usuarioCerIMSS == "Usuario de certificado IMSS cargado"){
      obj.usuarioCerIMSS = null;
    }

    this.objenviar = {
      registroPatronal: obj.registroPatronal,
      emPrimaRiesgo: obj.emPrimaRiesgo,
      emClaveDelegacionalImss: obj.emClaveDelegacionalImss,
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar,
      centrocClienteId: {
        centrocClienteId: this.datos.empresa.centrocClienteId
      },
      usuarioImss: obj.usuarioCerIMSS,
      pwdImss: obj.contrasenaCerIMSS,
      certificadoImss: obj.cerIMSS,
      esActivo:	true,

    }
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    

    if (!Boolean(this.arregloImss?.registroPatronalId)) {

      this.imssPrd.save(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            this.enviado.emit({type:"cancelar"});
          }
        });
      });
    } else {

      this.objenviar.registroPatronalId = this.arregloImss.registroPatronalId;
      console.log(JSON.stringify(this.objenviar));
      
      this.imssPrd.modificar(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(()=>{
            if (datos.resultado) {
              this.enviado.emit({type:"cancelar"});
            }    
        })
      });

    }
  }
}


