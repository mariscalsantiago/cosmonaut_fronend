import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from '../../../eventos/services/eventos.service';
import { EmpresasService } from '../../../empresas/services/empresas.service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfrontaService } from '../../../../shared/services/confronta/confronta.service';



@Component({
  selector: 'app-detalleconfronta',
  templateUrl: './detalleconfronta.component.html',
  styleUrls: ['./detalleconfronta.component.scss']
})
export class DetalleconfrontaComponent implements OnInit {
  @ViewChild("inputFile") public inputFile!: ElementRef;

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public arregloIncidenciaTipo: any = [];
  public arregloEmpleados: any = [];
  public arregloTipoIncapacidad: any = [];
  public tagcomponente: boolean = false;
  public arregloUnidadMedida: any = [];
  public arregloFechas: any = [];
  public buttonSave="Aceptar";
  public buttonCancel ="Cancelar";
  public idEmpresa: number = 0;
  public arregloEmisiones:any = [];
  public arregloMeses:any = [];
  public arregloRegistroPatronal: any = [];
  tipo =1;

  constructor(private modalPrd: ModalService,  private  confrontaProd: ConfrontaService,
    private empresasPrd: EmpresasService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private router: Router,
    public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();

    this.myForm = this.createForms({});
    this.confrontaProd.getEmisiones().subscribe(datos => this.arregloEmisiones = datos.datos);

    this.empresasPrd.getListarRegistroPatronal(this.idEmpresa).subscribe(datos => this.arregloRegistroPatronal = datos.datos);
    

  }



  public createForms(obj: any) {

    return this.formbuilder.group({
      idregistroPatronal: ['0', [Validators.required]],
      archivo: ['', [Validators.required]],
      tipoEmisionId: ['0', [Validators.required]],
      mes: [{value:'0', disabled: true}, [Validators.required]],
      anio:['', [Validators.required]]
    });
  }


  public get f() {
    return this.myForm.controls;
  }

  public enviarPeticion() {
    this.submitEnviado = true;

      if(this.myForm.controls.idregistroPatronal.value === "0"){
        this.myForm.controls.idregistroPatronal.setErrors({required: true})
      }
      if(this.myForm.controls.tipoEmisionId.value === "0"){
        this.myForm.controls.tipoEmisionId.setErrors({required: true})
      }
      if(this.myForm.controls.mes.value === "0"){
        this.myForm.controls.mes.setErrors({required: true})
      }

    if (this.myForm.invalid) {
     this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }
    let mensaje = "¿Deseas realizar la confronta del año y mes seleccionados?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      this.modalPrd.showMessageDialog(this.modalPrd.dispersar,"Realizando confronta","El sistema está procesando la información, espera unos momentos.");
      let intervalo = interval(1000);
      intervalo.pipe(take(11));
      intervalo.subscribe((valor)=>{
      this.configuracionPrd.setCantidad(valor*10);
      if(valor == 11){
      valor = 0;
      this.configuracionPrd.setCantidad(0);
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.buttonCancel="Regresar";
      this.buttonSave ="Descargar Confronta"
    } else if(valor > 11){
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    }
    });
    });





  }





  public cancelar() {
    this.router.navigate(['/imss/confronta']);
  }

  public abrirArchivo() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputFile.nativeElement.value = imagenInput![0].name;
     /* for (let item in Object.getOwnPropertyNames(imagenInput)) {
        let archivo: File = imagenInput[item];
        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.urlArchivo.setValue(this.arrayBufferToBase64(datos));
        });
      }*/

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



  public recibirEtiquetas(obj: any) {
    let fecha = obj.lenght == 0 ? "" : obj[0];
    this.myForm.controls.fechaInicio.setValue(fecha);
    this.arregloFechas = obj;
  }

  public tipoEmision(event: any){
    this.myForm.controls.mes.disable();
    this.arregloMeses = [];
    this.tipo = Number(event.target.value);
    this.confrontaProd.getMeses(this.tipo).subscribe(datos => this.arregloMeses = datos.datos);
    this.myForm.controls.mes.enable();
  }

}
