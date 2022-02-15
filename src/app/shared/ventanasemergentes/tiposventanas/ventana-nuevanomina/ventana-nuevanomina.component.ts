import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-ventana-nuevanomina',
  templateUrl: './ventana-nuevanomina.component.html',
  styleUrls: ['./ventana-nuevanomina.component.scss']
})
export class VentanaNuevanominaComponent implements OnInit {

  @Output() salida = new EventEmitter<any>();
  @ViewChild("fechafin") fechafin!: ElementRef;

  public arreglogruposnomina: any = [];

  public myForm!: FormGroup;


  public limiteDias: number = 0;

  public fechaMaxima: string = "";

  constructor(private modalPrd: ModalService, private grupoNominaPrd: GruponominasService,
    private usuariosPrd: UsuarioSistemaService, private formbuilder: FormBuilder,
    private usuarioSistemaPrd: UsuarioSistemaService, private nominaOrdinariaPrd: NominaordinariaService) { }

  ngOnInit(): void {
    this.grupoNominaPrd.getAll(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arreglogruposnomina = datos.datos);
    this.myForm = this.creandoForm();

    this.suscripciones();
  }

  public suscripciones() {


    this.f.fechaIniPeriodo.valueChanges.subscribe(valor => {
      
      if (valor) {
        this.f.fechaFinPeriodo.setValue("");
        if (this.f.fechaIniPeriodo.valid) {
          this.f.fechaFinPeriodo.enable();
          this.fechafin.nativeElement.min = valor;
        } else {
          this.f.fechaFinPeriodo.disable();
          this.f.fechaFinPeriodo.setValue("");
        }

        let fechaActual = new Date(valor);
        fechaActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + this.limiteDias);

        this.fechaMaxima = String(new DatePipe("es-MX").transform(fechaActual, "yyyy-MM-dd"));
      }

    })

    this.f.grupoNomina.valueChanges.subscribe(valor => {
      let gruponomina = this.arreglogruposnomina.filter((mm: any) => valor == mm.id)[0];
      
      switch (gruponomina.periodo) {
        case "Semanal":
          this.limiteDias = 7;
          break;
        case "Quincenal":
          this.limiteDias = 16;
          break;
        case "Mensual":
          this.limiteDias = 31;
          break;
        case "Decenal":
          this.limiteDias = 10;
          break;
        case "Catorcenal":
          this.limiteDias = 14;
          break;
      }
      this.f.fechaIniPeriodo.enable();
      this.f.fechaIniPeriodo.setValue("");
      this.f.fechaFinPeriodo.setValue("");
      this.f.fechaFinPeriodo.disable();
    });



  }


  public creandoForm() {

    return this.formbuilder.group(
      {
        clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        grupoNomina: [, [Validators.required]],
        usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId,
        fechaIniPeriodo: [{ value: '', disabled: true }, [Validators.required]],
        fechaFinPeriodo: [{ value: '', disabled: true }, [Validators.required]],
        nombreNomina: [, [Validators.required]]
      }
    );
  }


  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }

  public validaFechaFinCaptura(){
    
    let fechafinCap = this.myForm.controls.fechaFinPeriodo.value;

    if(this.limiteDias === 31){
      let fechaMax = new Date(this.fechaMaxima);
      fechaMax = new Date(fechaMax.getFullYear(), fechaMax.getMonth(), fechaMax.getDate() - 3);
      let fechaMaxUlt = String(new DatePipe("es-MX").transform(fechaMax, "yyyy-MM-dd"));
      if(fechafinCap < fechaMaxUlt){
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin está fuera del periodo seleccionado.');
        this.myForm.controls.fechaFinPeriodo.setValue('');
        this.myForm.controls.fechaFinPeriodo.updateValueAndValidity();
      }
    }else{
      if(fechafinCap < this.fechaMaxima){
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin está fuera del periodo seleccionado.');
        this.myForm.controls.fechaFinPeriodo.setValue('');
        this.myForm.controls.fechaFinPeriodo.updateValueAndValidity();
      }

    }  

  }


  public validaFechaFinal(): Boolean{
    
    let respuesta: boolean = true;
    let fechaInicioP = this.myForm.controls.fechaIniPeriodo.value;
    let fechafinP = this.myForm.controls.fechaFinPeriodo.value;

      if (fechafinP > this.fechaMaxima) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin está fuera del periodo seleccionado.');
        this.myForm.controls.fechaFinPeriodo.setValue("");
        respuesta = false;
      }
      if ( fechafinP < fechaInicioP) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin debe ser mayor a la fecha de inicio.');
        this.myForm.controls.fechaFinPeriodo.setValue("");
        respuesta = false;
      }

    return respuesta;

  }


  public enviarPeticion() {


    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    if (!this.validaFechaFinal()) {
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

    let objEnviar = {
      ...this.myForm.value,
      fechaIniIncidencia: this.myForm.value.fechaIniPeriodo,
      fechaFinIncidencia: this.myForm.value.fechaFinPeriodo
    }

    this.nominaOrdinariaPrd.crearNomina(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          this.salida.emit({
            type: "guardar", datos: datos
          });
        }
      })
    });

  }


  public get f() {
    return this.myForm.controls;
  }

}
