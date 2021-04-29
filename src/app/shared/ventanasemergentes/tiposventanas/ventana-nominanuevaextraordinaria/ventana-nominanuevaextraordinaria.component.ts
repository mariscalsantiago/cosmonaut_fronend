import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CalculosService } from 'src/app/shared/services/calculos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-ventana-nominanuevaextraordinaria',
  templateUrl: './ventana-nominanuevaextraordinaria.component.html',
  styleUrls: ['./ventana-nominanuevaextraordinaria.component.scss']
})
export class VentanaNominanuevaextraordinariaComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  @ViewChild("fechafin") fechafin!: ElementRef;

  

  public myForm!: FormGroup;

  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private calculoPrd: CalculosService) { }

  ngOnInit(): void {
    this.myForm = this.creandoForm();

    this.suscripciones();
  }

  public suscripciones() {


    this.f.fechaIniPeriodo.valueChanges.subscribe(valor => {
      if (this.f.fechaIniPeriodo.valid) {
        this.f.fechaFinPeriodo.enable();
        this.fechafin.nativeElement.min = valor;
      } else {
        this.f.fechaFinPeriodo.disable();
        this.f.fechaFinPeriodo.setValue("");
      }
    })



  }


  public creandoForm() {

    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        grupoNomina: [, [Validators.required]],
        usuarioId: this.usuarioSistemaPrd.getUsuario().idUsuario,
        fechaIniPeriodo: [, [Validators.required]],
        fechaFinPeriodo: [{ value: '', disabled: true }, [Validators.required]],
        nombreNomina: [, [Validators.required]]
      }
    );
  }


  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }


  public guardar() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas registrar la nómina?").then(valor => {
      if (valor) {
        this.salida.emit({ type: "guardar", datos: valor });
      }
    });
  }



  public enviarPeticion() {
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas crear la  nómina?").then(valor => {
      if (valor) {
        this.guardarNomina();
      }

    });
  }


  public guardarNomina() {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.calculoPrd.crearNomina(this.myForm.value).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      console.log("Despues de guardar la nómina", datos);
      this.salida.emit({
        type: "guardar", datos: datos
      });
    });

  }


  public get f() {
    return this.myForm.controls;
  }

}
