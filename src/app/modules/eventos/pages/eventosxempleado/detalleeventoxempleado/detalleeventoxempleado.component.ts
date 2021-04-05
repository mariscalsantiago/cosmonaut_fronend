import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../../../empleados/services/empleados.service';

@Component({
  selector: 'app-detalleeventoxempleado',
  templateUrl: './detalleeventoxempleado.component.html',
  styleUrls: ['./detalleeventoxempleado.component.scss']
})
export class DetalleeventoxempleadoComponent implements OnInit {

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public arregloIncidenciaTipo: any = [];
  public arregloEmpleados: any = [];
  public arregloTipoIncapacidad: any = [];

  constructor(private modalPrd: ModalService, private catalogosPrd: CatalogosService, private formbuilder: FormBuilder, private usuarioSistemaPrd: UsuarioSistemaService,
    private empleadosPrd: EmpleadosService, private router: Router) { }

  ngOnInit(): void {

    this.myForm = this.createForms({});
    this.catalogosPrd.getTipoIncidencia(true).subscribe(datos => this.arregloIncidenciaTipo = datos.datos);
    this.catalogosPrd.getTipoIncapacidad(true).subscribe(datos => this.arregloTipoIncapacidad = datos.datos);
    let objenviar = {
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      esActivo: "true"
    }

    this.empleadosPrd.filtrar(objenviar).subscribe(datos => this.arregloEmpleados = datos.datos);

  }

  public createForms(obj: any) {
    return this.formbuilder.group({
      incidenciaId: ['', [Validators.required]],
      personaId: ['', [Validators.required]],
      duracion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      monto: [0, [Validators.required]],
      fechaFin: ['', Validators.required],
      fechaAplicacion: ['', Validators.required],
      tipoIncapacidadId: ['', Validators.required],
      urlArchivo: [''],
      numeroFolio: ['', Validators.required],
      comentarios: ['']

    });
  }


  public get f() {
    return this.myForm.controls;
  }

  public enviarPeticion() {
    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }



    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas registrar el evento?").then(valor =>{
      if(valor){

        this.guardarEvento();



      }
    });;
  

  }


  public guardarEvento(){
    let obj = this.myForm.value;

    let objEnviar = {
      ...obj,
      tipoIncapacidadId:{
        tipoIncapacidadId:obj.tipoIncapacidadId
      }
    }
  }


  public cancelar() {
    this.router.navigate(['/eventos/eventosxempleado']);
  }

  public abrirArchivo() {

  }


  public verificar(cadena: string) {

    let ocultar = true;

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);

    

    switch (cadena) {
      case "dias":
        console.log("Esto es el valor", this.myForm.controls.incidenciaId.value);
        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 3:
          case 9:
          case 10:
          case 11:
            ocultar = false;
            break;
        }
        console.log(ocultar, "Esto se oculta");
        break;
      case "fechainicio":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
            ocultar = false;
            break;
        }

        break;
      case "fechafin":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
            ocultar = false;
            break;
        }


        break;
      case "fechaaplicacion":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
            ocultar = false;
            break;
        }
        break;
    }


    return ocultar;
  }

  public configurandoRestricciones(){

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);
    for(let llave in this.myForm.controls){
      this.myForm.controls[llave].setErrors(null);
    }
   
      

      this.myForm.controls.incidenciaId.setErrors({required:true});
      this.myForm.controls.personaId.setErrors({required:true});
      

      if(seleccionado == 1 || seleccionado == 2 || seleccionado == 5){
        this.myForm.controls.duracion.setErrors({required:true});
        this.myForm.controls.fechaInicio.setErrors({required:true});
        this.myForm.controls.fechaFin.setErrors({required:true});
        this.myForm.controls.fechaAplicacion.setErrors({required:true});
      }
  }

}
