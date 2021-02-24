import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalempleadosService } from 'src/app/modules/empleados/services/modalempleados.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public myForm!: FormGroup;





  public editarcampos: boolean = false;
  public empleado: any = {
    nacionalidadId: {}
  };
  public anio!: string;
  public mes!: string;
  public dia!: string;

  constructor(private formBuilder: FormBuilder, private modalPrd: ModalempleadosService,
    private navparams: ActivatedRoute, private empleadoPrd: EmpleadosService) { }

  ngOnInit(): void {
    this.myForm = this.createForm({});
    this.navparams.params.subscribe(param => {

      let idEmpleado = param["id"];


      this.empleadoPrd.getEmpleadoById(idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;

        this.parsearInformacion();
        console.log(this.empleado);

        this.myForm = this.createForm(this.empleado);

      });




    });




  }

  public parsearInformacion(){
    if (this.empleado.fechaNacimiento != null || this.empleado.fechaNacimiento != undefined) {

      if (this.empleado.fechaNacimiento.trim() !== "") {

        let split = this.empleado.fechaNacimiento.split("/");

        this.anio = split[2];
        let mesint: number = Number(split[1]);
        let arreglo = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        this.mes = arreglo[mesint];
        this.dia = split[0];

      }

    }

    this.empleado.contactoEmergenciaParentescoDescripcion = "";
    switch (this.empleado.contactoEmergenciaParentesco) {

      case "P":
        this.empleado.contactoEmergenciaParentescoDescripcion = "Padre";
        break;
      case "M":
        this.empleado.contactoEmergenciaParentescoDescripcion = "Madre";
        break;
      case "H":
        this.empleado.contactoEmergenciaParentescoDescripcion = "Hijo";
        break;
      case "B":
        this.empleado.contactoEmergenciaParentescoDescripcion = "Abuelo";
        break;
      case "O":
        this.empleado.contactoEmergenciaParentescoDescripcion = "Otro";
        break;

    }
  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      
    });
  }

  public recibir(obj: any) {





  }

  public enviandoFormulario() {

    this.modalPrd.getModal().modal = true;
    this.modalPrd.getModal().strsubtitulo = "Vas a modificar el perfil del usuario ¿Deseas continuar?";
    this.modalPrd.getModal().iconType = "warning";
    this.modalPrd.getModal().strTitulo = "¿Deseas modificar el empleado?";


    this.modalPrd.esperarPeticion().subscribe(datos => {
      if (datos.valor == "aceptado") {

        //Guardar la petición; 

        setTimeout(() => {
          this.modalPrd.getModal().modal = true;
          this.modalPrd.getModal().strsubtitulo = "Vas a modificar el perfil del usuario ¿Deseas continuar?";
          this.modalPrd.getModal().iconType = "success";
          this.modalPrd.getModal().strTitulo = "¿Deseas modificar el empleado?";
          this.modalPrd.esperarPeticion().subscribe(datos => {

            if (datos.valor == "finalizado") {
              this.editarcampos = false;
            }
          });
        }, 2000);

      }
    });



  }

  public cancelarOperacion() {
  }

}
