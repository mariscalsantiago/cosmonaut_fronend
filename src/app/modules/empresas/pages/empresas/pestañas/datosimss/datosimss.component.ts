import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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

    return this.formBuilder.group({
      registroPatronal: [obj.registroPatronal, [Validators.required, Validators.pattern(/^[A-Za-z,ñ,Ñ,&]/)]],
      emPrimaRiesgo: [obj.emPrimaRiesgo, [Validators.required, Validators.pattern(/[0-9]{1}(\.[0-9])/)]],
      emClaveDelegacionalImss: [obj.emClaveDelegacionalImss, [Validators.required, Validators.pattern(/^\d{2}$/)]],
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar

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

  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);

  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
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

    let obj = this.myForm.value;

    if (!this.datos.insertar && this.arregloImss.registroPatronalId == undefined) {
      this.insertarMof = true;
    }

    this.objenviar = {
      registroPatronal: obj.registroPatronal,
      emPrimaRiesgo: obj.emPrimaRiesgo,
      emClaveDelegacionalImss: obj.emClaveDelegacionalImss,
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar,
      centrocClienteId: {
        centrocClienteId: this.datos.empresa.centrocClienteId
      }

    }

    if (this.datos.insertar) {

      this.imssPrd.save(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            if (this.insertarMof) {
              this.enviado.emit({
                type: "sedeCont"
              });
            } else {
              this.routerPrd.navigate(["/listaempresas"]);
            }
          }
        });
      });
    } else {

      this.objenviar.registroPatronalId = this.arregloImss.registroPatronalId;
      this.imssPrd.modificar(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
      });

    }
  }
}


