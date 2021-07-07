import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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
  @ViewChild("inputFile") public inputFile!: ElementRef;

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public arregloIncidenciaTipo: any = [];
  public arregloEmpleados: any = [];
  public arregloTipoIncapacidad: any = [];
  public tagcomponente: boolean = false;
  public arregloUnidadMedida: any = [];
  public arregloFechas: any = [];

  constructor(private modalPrd: ModalService, private catalogosPrd: CatalogosService, private formbuilder: FormBuilder, private usuarioSistemaPrd: UsuarioSistemaService,
    private empleadosPrd: EmpleadosService, private router: Router, private eventoPrd: EventosService,
    public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {



    this.myForm = this.createForms({});

    this.suscribirse();
    this.catalogosPrd.getTipoIncidencia(true).subscribe(datos => this.arregloIncidenciaTipo = datos.datos);
    this.catalogosPrd.getTipoIncapacidad(true).subscribe(datos => this.arregloTipoIncapacidad = datos.datos);
    console.log('eventos',this.arregloIncidenciaTipo)
    this.catalogosPrd.getUnidadMedida(true).subscribe(datos => {
      this.arregloUnidadMedida = [];
      if (datos.datos) {
        for (let item of datos.datos) {
          if (item.unidadMedidaId == 2) {
            continue;
          }
          this.arregloUnidadMedida.push(item);
        }
      }

    });
    let objenviar = {
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      esActivo: "true"
    }

    this.empleadosPrd.filtrar(objenviar).subscribe(datos => this.arregloEmpleados = datos.datos);

  }


  public suscribirse() {
    this.myForm.controls.unidadmedida.valueChanges.subscribe(valor => {

      switch (valor) {
        case "1":
          this.myForm.controls.numerohoras.setValidators([Validators.required]);
          this.myForm.controls.numerohoras.updateValueAndValidity();

          this.myForm.controls.monto.clearValidators();
          this.myForm.controls.monto.updateValueAndValidity();
          break;
        case "3":

          this.myForm.controls.numerohoras.clearValidators();
          this.myForm.controls.numerohoras.updateValueAndValidity();
          this.myForm.controls.monto.setValidators([Validators.required]);
          this.myForm.controls.monto.updateValueAndValidity();
          break;
      }
    });
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
      archivo: [''],
      numeroFolio: ['', Validators.required],
      comentarios: [''],
      identificadorPersona: [''],
      fechaContrato: [''],
      unidadmedida: [],
      numerohoras: []

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


    let seleccionado = Number(this.myForm.controls.incidenciaId.value);
    let multifechas: boolean = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);
    switch (seleccionado) {
      case 1:
      case 2:
      case 5:
        delete objEnviar.fechaFin;
        delete objEnviar.monto;
        delete objEnviar.urlArchivo;
        delete objEnviar.archivo;
        delete objEnviar.numeroFolio;
        delete objEnviar.unidadmedida;
        delete objEnviar.numerohoras;
        delete objEnviar.tipoIncapacidadId;
        multifechas = true;
        break;
      case 11:
      case 16:
        delete objEnviar.numeroFolio;
        delete objEnviar.numerohoras;
        delete objEnviar.unidadmedida;
        delete objEnviar.urlArchivo;
        delete objEnviar.archivo;
        delete objEnviar.fechaFin;
        delete objEnviar.tipoIncapacidadId;
        break;
      case 13:
      case 14:
        delete objEnviar.duracion;
        delete objEnviar.numeroFolio;
        delete objEnviar.urlArchivo;
        delete objEnviar.archivo;
        delete objEnviar.fechaFin;
        delete objEnviar.tipoIncapacidadId;
        objEnviar.unidadMedidaId = {
          unidadMedidaId: obj.unidadmedida
        }
        objEnviar.heTiempo = obj.numerohoras;
        break;
      case 3:
        delete objEnviar.monto;
        delete objEnviar.numerohoras;
        break;
      case 9:
        delete objEnviar.tipoIncapacidadId;
        delete objEnviar.fechaInicio;
        delete objEnviar.monto;
        delete objEnviar.numeroFolio;
        delete objEnviar.numerohoras;
        delete objEnviar.unidadmedida;
        delete objEnviar.urlArchivo;
        delete objEnviar.archivo;
        delete objEnviar.fechaFin;


        break;
      case 8:
        delete objEnviar.tipoIncapacidadId;
        delete objEnviar.fechaFin;
        delete objEnviar.duracion;
        delete objEnviar.urlArchivo;
        delete objEnviar.archivo;
        delete objEnviar.numeroFolio;
        delete objEnviar.unidadmedida;
        delete objEnviar.numerohoras;
        break;
    }

    delete objEnviar.incidenciaId;

    let objEnviarArray: Array<any>;




    if (multifechas) {
      objEnviarArray = [];
      for (let item of this.arregloFechas) {
        let aux = JSON.parse(JSON.stringify(objEnviar));

        aux.fechaInicio = new Date((new Date(item).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        aux.duracion = 1;
        objEnviarArray.push(aux);
      }
    } else {
      objEnviarArray = [objEnviar]
    }






    //  this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    //return;
    this.eventoPrd.save(objEnviarArray).subscribe(datos => {
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
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputFile.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.urlArchivo.setValue(this.arrayBufferToBase64(datos));
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
          case 1:
          case 2:
          case 5:
          case 9:
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
          case 3:
            ocultar = false;
            break;
        }

        break;
      case "fechafin":

        switch (seleccionado) {
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
        
        break;
      case "unidad":
        switch (seleccionado) {
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
      case "horas":
        switch (seleccionado) {
          case 13:
          case 14:
            ocultar = false;
            break;
        }
        break;
    }


    return ocultar;
  }

  public configurandoRestricciones() {

    let seleccionado = Number(this.myForm.controls.incidenciaId.value);

    let multifechas: boolean = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);
    if (multifechas) {
      this.myForm.controls.fechaInicio.setValue("");
    }
    for (let llave in this.myForm.controls) {
      if (llave == "incidenciaId" || llave == "personaId")
        continue;


      this.myForm.controls[llave].clearValidators();
      this.myForm.controls[llave].updateValueAndValidity();
    }



    this.tagcomponente = (seleccionado == 1 || seleccionado == 2 || seleccionado == 5 || seleccionado == 11 || seleccionado == 16 || seleccionado == 9);




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

    if (seleccionado == 13 || seleccionado == 14) {
      this.myForm.controls.unidadmedida.setValidators([Validators.required]);
      this.myForm.controls.unidadmedida.updateValueAndValidity();
      this.myForm.controls.numerohoras.setValidators([Validators.required]);
      this.myForm.controls.numerohoras.updateValueAndValidity();
    }

    if (seleccionado == 9) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();

      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
    }

    if (seleccionado == 10 || seleccionado == 11 || seleccionado == 16) {
      this.myForm.controls.duracion.setValidators([Validators.required]);
      this.myForm.controls.duracion.updateValueAndValidity();
      this.myForm.controls.fechaAplicacion.setValidators([Validators.required]);
      this.myForm.controls.fechaAplicacion.updateValueAndValidity();
      this.myForm.controls.fechaInicio.setValidators([Validators.required]);
      this.myForm.controls.fechaInicio.updateValueAndValidity();
    }
  }


  public perderFoco() {


    const totalDias = this.myForm.controls.duracion.value;
    if (totalDias) {
      if (this.myForm.controls.fechaInicio.value) {
        var datePipe = new DatePipe("es-MX");
        let fechaActual = new Date((new Date(this.myForm.controls.fechaInicio.value)).toUTCString().replace("GMT", ""));
        let fechaFin: Date = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + (Number(totalDias) <= 0 ? 0 : Number(totalDias) - 1));

        this.myForm.controls.fechaFin.setValue(datePipe.transform(fechaFin, "yyyy-MM-dd"));
      }

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


  public recibirEtiquetas(obj: any) {
    let fecha = obj.lenght == 0 ? "" : obj[0];
    this.myForm.controls.fechaInicio.setValue(fecha);
    this.arregloFechas = obj;
  }

}
