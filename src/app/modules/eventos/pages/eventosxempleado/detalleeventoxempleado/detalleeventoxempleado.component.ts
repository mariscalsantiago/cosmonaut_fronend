import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../../../empleados/services/empleados.service';
import { EventosService } from '../../../services/eventos.service';

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
    private empleadosPrd: EmpleadosService, private router: Router, private eventoPrd: EventosService) { }

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
    var datePipe = new DatePipe("es-MX");
    return this.formbuilder.group({
      incidenciaId: ['', [Validators.required]],
      personaId: ['', [Validators.required]],
      duracion: ['', Validators.required],
      fechaInicio: [datePipe.transform(new Date(), "yyyy-MM-dd"), Validators.required],
      monto: ['', [Validators.required]],
      fechaFin: [{ value: datePipe.transform(new Date(), "yyyy-MM-dd"), disabled: true }, Validators.required],
      fechaAplicacion: ['', Validators.required],
      tipoIncapacidadId: ['', Validators.required],
      urlArchivo: [''],
      numeroFolio: ['', Validators.required],
      comentarios: [''],
      identificadorPersona: [''],
      fechaContrato: ['']

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



    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas registrar el evento?").then(valor => {
      if (valor) {

        this.guardarEvento();



      }
    });;


  }


  public guardarEvento() {



    let obj = this.myForm.getRawValue();
    this.modalPrd.showMessageDialog(this.modalPrd.loading);


    if (obj.fechaInicio != undefined || obj.fechaInicio != '') {
      obj.fechaInicio = new Date((new Date(obj.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
    }

    if (obj.fechaFin != undefined || obj.fechaFin != '') {
      obj.fechaFin = new Date((new Date(obj.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
    }

    if (obj.fechaAplicacion != undefined || obj.fechaAplicacion != '') {
      obj.fechaAplicacion = new Date((new Date(obj.fechaAplicacion).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
    }

    let objEnviar = {
      ...obj,
      tipoIncapacidadId: {
        tipoIncapacidadId: obj.tipoIncapacidadId
      },
      tipoIncidenciaId: {
        tipoIncidenciaId: obj.incidenciaId
      },
      personaId: obj.identificadorPersona,
      clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
      fechaContrato: obj.fechaContrato
    }


    this.eventoPrd.save(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          this.router.navigate(['/eventos/eventosxempleado']);
        }
      });
    })

  }


  public cancelar() {
    this.router.navigate(['/eventos/eventosxempleado']);
  }

  public abrirArchivo() {

  }


  public verificar(cadena: string) {

    let ocultar = true;

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);


    var datePipe = new DatePipe("es-MX");
    switch (cadena) {
      case "dias":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 3:
          case 9:
          case 10:
          case 11:
          case 16:
            ocultar = false;
            break;
        }
        break;
      case "fecha":
        switch (seleccionado) {
          case 4:
          case 8:
          case 10:
          case 11:
          case 13:
          case 14:
          case 16:
            ocultar = false;
            break;
        }
        break;
      case "monto":
        switch (seleccionado) {
          case 4:
          case 8:
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "fechainicio":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 3:
            ocultar = false;
            break;
        }

        break;
      case "fechafin":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 3:
            ocultar = false;
            break;
        }


        break;
      case "fechaaplicacion":

        switch (seleccionado) {
          case 1:
          case 2:
          case 5:
          case 4:
          case 3:
          case 8:
          case 9:
          case 10:
          case 11:
          case 16:
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "incapacidad":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }
        break;
      case "archivo":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }
        break;
      case "folio":
        switch (seleccionado) {
          case 3:
            ocultar = false;
            break;
        }
        break;
      case "monto2":
        switch (seleccionado) {
          case 10:
          case 11:
          case 16:
          case 9:
            ocultar = false;
            break;
        }
        break;
    }


    return ocultar;
  }

  public configurandoRestricciones() {

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);
    for (let llave in this.myForm.controls) {
      if (llave == "incidenciaId" || llave == "personaId")
        continue;


      this.myForm.controls[llave].clearValidators();
      this.myForm.controls[llave].updateValueAndValidity();
    }






    if (seleccionado == 1 || seleccionado == 2 || seleccionado == 5) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.fechaFin.setValidators([Validators.required]);
      this.myForm.controls.fechaFin.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }
    if (seleccionado == 4) {
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }

    if (seleccionado == 3) {

      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.fechaFin.setValidators([Validators.required]);
      this.myForm.controls.fechaFin.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.tipoIncapacidadId.setValidators([Validators.required]);
      this.myForm.controls.tipoIncapacidadId.updateValueAndValidity();
      this.myForm.controls.numeroFolio.setValidators([Validators.required]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
    }

    if (seleccionado == 8 || seleccionado == 13 || seleccionado == 14) {
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
    }

    if (seleccionado == 9) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
    }

    if (seleccionado == 10 || seleccionado == 11 || seleccionado == 16) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.monto.setValidators([Validators.required]);
      this.myForm.controls.monto.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
    }
  }


  public perderFoco() {

    const totalDias = this.myForm.controls.duracion.value;
    if (totalDias !== undefined || totalDias !== null) {
      var datePipe = new DatePipe("es-MX");
      let fechaActual = new Date((new Date(this.myForm.controls.fechaInicio.value)).toUTCString().replace("GMT", ""));
      let fechaFin: Date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + (Number(totalDias) <= 0 ? 0 : Number(totalDias) - 1));

      this.myForm.controls.fechaFin.setValue(datePipe.transform(fechaFin, "yyyy-MM-dd"));
    }
  }


  public salirPersonaid() {
    this.myForm.controls.personaId.clearValidators();
    this.myForm.controls.personaId.updateValueAndValidity();

    this.myForm.value.identificadorPersona = undefined;
    const nombreCapturado = this.myForm.value.personaId;
    if (nombreCapturado !== undefined) {
      if (nombreCapturado.trim() !== "") {
        let encontrado: boolean = false;
        for (let item of this.arregloEmpleados) {
          const nombreCompleto = item.nombre + " " + item.apellidoPaterno;
          if (nombreCapturado.includes(nombreCompleto)) {
            encontrado = true;
            this.myForm.controls.identificadorPersona.setValue(item.idPersona);
            this.myForm.controls.fechaContrato.setValue(item.fechaContrato);

            break;
          }
        }


        this.myForm.controls.personaId.setValidators([Validators.required]);
        this.myForm.controls.personaId.updateValueAndValidity();
        
        if (encontrado) {
          this.myForm.controls.personaId.clearValidators();
          this.myForm.controls.personaId.updateValueAndValidity();
        } else {
          
          this.myForm.controls.identificadorPersona.setValue('');
          this.myForm.controls.fechaContrato.setValue('');
          this.myForm.controls.personaId.setValue('');
        }
      } else {
        this.myForm.controls.personaId.setValidators([Validators.required]);
        this.myForm.controls.personaId.updateValueAndValidity();
      }
    }

    
  }

}
