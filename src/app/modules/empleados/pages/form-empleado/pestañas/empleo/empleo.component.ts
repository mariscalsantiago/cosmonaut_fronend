import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { JornadalaboralService } from 'src/app/modules/empresas/pages/submodulos/jonadaLaboral/services/jornadalaboral.service';
import { PuestosService } from 'src/app/modules/empresas/pages/submodulos/puestos/pages/services/puestos.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { SharedPoliticasService } from 'src/app/shared/services/politicas/shared-politicas.service';
import { SharedSedesService } from 'src/app/shared/services/sedes/shared-sedes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CalculosService } from 'src/app/shared/services/nominas/calculos.service';




@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  @ViewChild("fechaAntiguedad") fechaAntiguedadElemento!: ElementRef;
  @ViewChild("fechaInicioCont") fechaInicioCont!: ElementRef;
  @ViewChild("fechaFinCont") fechaFinCont!: ElementRef;
  @Output() enviado = new EventEmitter();
  @Input() datosPersona: any;
  @Input() arregloEnviar: any;
  @Input() tabsDatos: any;


  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public enviadoSubmitArea: boolean = false;
  public apareceplusPuesto: boolean = false;
  public textoArea: string = "";
  public mensajeModalito: string = "";
  public desabilitarinput: boolean = false;
  public grupoNominaSeleccionado: any = {
    pagoComplementario: false
  };


  public aparecerTemp: boolean = true;

  public myForm!: FormGroup;
  public myFormArea!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglogruponominas: any = [];
  public arregloArea: any = [];
  public arregloPuestos: any = [];
  public arregloPoliticas: any = [];
  public arregloempleadosreporta: any = [];
  public arregloCompensacion: any = [];
  public arregloareasgeograficas: any = [];
  public arregloTipoContrato: any = [];
  public arregloJornadas: any = [];
  public arregloSedes: any = [];
  public arregloRegimenContratacion: any = [];
  public arregloEstados: any = [];
  public arregloMetodosPago: any = [];
  public obj: any = [];
  public fechaIC: Date = new Date();
  public fechaAntiguedad: Date = new Date();
  public activaFechaFin: boolean = true;
  public puestoIdReporta: number = 0;

  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;

  public id_empresa!: number;

  constructor(private formBuilder: FormBuilder, private routerPrd: Router, private gruponominaPrd: GruponominasService,
    private areasPrd: SharedAreasService, private politicasPrd: SharedPoliticasService,
    private empleadosPrd: EmpleadosService, private catalogosPrd: CatalogosService,
    private colaboradorPrd: ContratocolaboradorService,
    private usuarioSistemaPrd: UsuarioSistemaService,
    private jornadaPrd: JornadalaboralService, private sedesPrd: SharedSedesService,
    private modalPrd: ModalService, private puestosPrd: PuestosService,
    private calculoPrd: CalculosService) { }

  ngOnInit(): void {






    this.id_empresa = this.usuarioSistemaPrd.getIdEmpresa();

    this.obj = {};

    if (this.tabsDatos[3] !== undefined) {
      this.myForm = this.createForm(this.tabsDatos[3]);
    } else {
      this.myForm = this.createForm(this.obj);
    }
    this.cambiarSueldoField();

    this.gruponominaPrd.getAll(this.id_empresa).subscribe(datos => {
      this.arreglogruponominas = datos.datos
    });

    this.areasPrd.getAreasByEmpresa(this.id_empresa).subscribe(datos => this.arregloArea = datos.datos);
    this.politicasPrd.getPoliticasByEmpresa(this.id_empresa).subscribe(datos => this.arregloPoliticas = datos.datos);
    this.empleadosPrd.getEmpleadosCompania(this.id_empresa).subscribe(datos => this.arregloempleadosreporta = datos.datos);
    this.catalogosPrd.getCompensacion(true).subscribe(datos => this.arregloCompensacion = datos.datos);
    this.catalogosPrd.getAreasGeograficas(true).subscribe(datos => this.arregloareasgeograficas = datos.datos);
    this.catalogosPrd.getTipoContratos(true).subscribe(datos => this.arregloTipoContrato = datos.datos);
    this.jornadaPrd.jornadasByEmpresa(this.id_empresa).subscribe(datos => this.arregloJornadas = datos.datos);
    this.sedesPrd.getsedeByEmpresa(this.id_empresa).subscribe(datos => this.arregloSedes = datos.datos);
    this.catalogosPrd.getTipoRegimencontratacion(true).subscribe(datos => this.arregloRegimenContratacion = datos.datos);
    this.catalogosPrd.getAllEstados(true).subscribe(datos => this.arregloEstados = datos.datos);
    this.catalogosPrd.getAllMetodosPago(true).subscribe(datos => this.arregloMetodosPago = datos.datos);


    this.suscripciones();

  }


  ngAfterViewInit(): void {

    const datepipe = new DatePipe("es-MX");
    let diamaximo = datepipe.transform(new Date, "yyyy-MM-dd")
    this.fechaAntiguedadElemento.nativeElement.max = diamaximo;


  }


  public suscripciones() {
    this.myForm.controls.sueldoBrutoMensual.valueChanges.subscribe(valor => {
    });
    this.myForm.controls.fechaAntiguedad.valueChanges.subscribe(valor => {
      this.fechaInicioCont.nativeElement.min = valor;
    });

    this.myForm.controls.fechaInicio.valueChanges.subscribe(valor => {
      this.fechaFinCont.nativeElement.min = valor;
    });



  }


  public createFormArea(parametro: boolean, nombre: string) {
    return this.formBuilder.group(
      {
        nombreCorto: [{ value: nombre, disabled: parametro }, [Validators.required]],
        puesto: ["", [Validators.required]],
      });
  }

  public agregarAreasModal() {
    this.myFormArea = this.createFormArea(false, "");
    this.aparecemodalito = true;
    this.mensajeModalito = "Área";
  }

  public agregarPuestoModal() {
    this.mensajeModalito = "Puesto";
    this.myFormArea = this.createFormArea(true, this.textoArea);
    this.aparecemodalito = true;
  }

  public validarfechAntiguedad(fecha: any) {


    let fechaInicioContra = fecha;
    var fecha = fecha.split("-");
    this.fechaAntiguedad.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
    var today = new Date();

    if (this.fechaAntiguedad > today) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha debe ser igual o menor a la fecha actual')
        .then(() => {
          this.myForm.controls.fechaAntiguedad.setValue("");
          this.myForm.controls.fechaInicio.setValue("");
        });

    } else {
      this.myForm.controls.fechaInicio.setValue(fechaInicioContra);
    }
  }

  public validarfechaInicioCont(fecha: any) {



    if (fecha != "") {
      if (`${this.myForm.controls.fechaAntiguedad.value}`.trim() !== "" && `${this.myForm.controls.fechaAntiguedad.value}`.trim() !== "null") {
        var fecha = fecha.split("-");
        this.fechaIC.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
      } else {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'Debes seleccionar la fecha de antigüedad')
          .then(() => {
            this.myForm.controls.fechaInicio.setValue("");
            this.myForm.controls.fechaFin.setValue("");
          });
      }
    }
  }

  public validarfechaFinCont(fecha: any) {


    var fechaFC = new Date();
    var fecha = fecha.split("-");
    fechaFC.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
    if (`${this.myForm.controls.fechaInicio.value}`.trim() !== "null" && `${this.myForm.controls.fechaInicio.value}`.trim() !== "") {
      if (fechaFC < this.fechaIC) {

        this.modalPrd.showMessageDialog(false, 'La fecha debe ser mayor a la fecha incio de contrato')
          .then(() => {
            this.myForm.controls.fechaFin.setValue("");
          });

      }
    } else {

      this.modalPrd.showMessageDialog(false, 'Debe colocar una fecha incio de contrato ')
        .then(() => {
          this.myForm.controls.fechaFin.setValue("");
        });
    }
  }

  public validartipoContrato(idContrato: any) {

    if (idContrato == 1) {
      this.activaFechaFin = false;
    }
    else if (idContrato == 10) {
      this.activaFechaFin = false;
    } else {
      this.activaFechaFin = true;
    }

  }

  public get f2() {
    return this.myFormArea.controls;
  }


  public enviarPeticinoArea() {


    


    this.enviadoSubmitArea = true;
    if (this.myFormArea.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }


    const titulo = (this.myFormArea.value.nombreCorto !== undefined) ? "¿Deseas registrar un área?" : "¿Deseas registrar un puesto?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {

        let obj = this.myFormArea.value;



        let objEnviar: any = {
          centrocClienteId: this.id_empresa,
          nclPuestoDto: [
            {
              descripcion: obj.puesto,
              nombreCorto: obj.puesto,
              centrocClienteId: this.id_empresa
            }
          ]
        }


        if (this.myFormArea.value.nombreCorto !== undefined) {
          objEnviar.descripcion = obj.nombreCorto;
          objEnviar.nombreCorto = obj.nombreCorto;

          this.puestosPrd.save(objEnviar).subscribe(datos => {



            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {


                datos.datos.descripcion = datos.datos?.nombreArea;
                this.arregloArea.push(datos.datos);

                this.aparecemodalito = false;
                this.enviadoSubmitArea = false;
              }
            });

          });
        } else {
          objEnviar.areaId = this.myForm.controls.areaId.value;

          this.puestosPrd.savepuest(objEnviar).subscribe(datos => {


            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {

                datos.datos.descripcion = datos.datos?.nombrePuesto;
                this.arregloPuestos.push(datos.datos);

                this.aparecemodalito = false;
                this.enviadoSubmitArea = false;



              }
            });

          });
        }






      }

    });
  }

  public createForm(obj: any) {

    if (obj.areaGeograficaId == undefined) {
      obj.areaGeograficaId = 1;
    }
    const pipe = new DatePipe("es-MX");

    return this.formBuilder.group({
      areaId: [obj.areaId?.areaId, [Validators.required]],
      puestoId: [{ value: obj.puestoId?.puestoId, disabled: true }, [Validators.required]],
      puesto_id_reporta: [obj.puesto_id_reporta],
      sedeId: [obj.sedeId?.sedeId],
      estadoId: [obj.estadoId?.estadoId, [Validators.required]],
      politicaId: [obj.politicaId?.politicaId, [Validators.required]],
      personaId: [this.datosPersona.personaId, [Validators.required]],
      esSindicalizado: [obj.esSindicalizado == undefined ? 'false' : `${obj.esSindicalizado}`],
      fechaAntiguedad: [(obj.fechaAntiguedad !== undefined && obj.fechaAntiguedad !== "") ? pipe.transform(new Date(Number(obj.fechaAntiguedad)), "yyyy-MM-dd") : obj.fechaAntiguedad, [Validators.required]],
      tipoContratoId: [obj.tipoContratoId?.tipoContratoId, [Validators.required]],
      fechaInicio: [(obj.fechaInicio !== undefined && obj.fechaInicio !== "") ? pipe.transform(new Date(Number(obj.fechaInicio)), "yyyy-MM-dd") : obj.fechaInicio, Validators.required],
      fechaFin: [{ value: (obj.fechaFin !== undefined && obj.fechaFin !== "") ? pipe.transform(new Date(Number(obj.fechaFin)), "yyyy-MM-dd") : obj.fechaFin, disabled: false }],
      jornadaId: [obj.jornadaId?.jornadaId, [Validators.required]],
      grupoNominaId: [obj.grupoNominaId?.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId?.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: [obj.sueldoBrutoMensual, [Validators.required]],
      sueldoNetoMensual: obj.sueldoNetoMensual,
      salarioDiario: [{ value: obj.salarioDiario, disabled: true }, []],
      dias_vacaciones: [obj.diasVacaciones, [Validators.required]],
      metodo_pago_id: [obj.metodoPagoId?.metodoPagoId, [Validators.required]],
      tipoRegimenContratacionId: [obj.tipoRegimenContratacionId?.tipoRegimenContratacionId, [Validators.required]],
      areaGeograficaId: [obj.areaGeograficaId?.areaGeograficaId, [Validators.required]],
      esSubcontratado: [obj.esSubcontratado],
      tiposueldo: ['b', [Validators.required]],
      subcontratistaId: obj.subcontratistaId,
      puestoIdReporta: obj.jefeInmediatoId?.personaId,
      fechaAltaImss: [(obj.fechaAltaImss !== undefined && obj.fechaAltaImss !== "") ? pipe.transform(new Date(Number(obj.fechaAltaImss)), "yyyy-MM-dd") : obj.fechaAltaImss],
      sbc: [{ value: obj.sbc, disabled: true }],
      salarioDiarioIntegrado: [obj.salarioDiarioIntegrado, []],
      salarioNetoMensualImss:[obj.salarioNetoMensualImss],
      pagoComplementario:[obj.pagoComplementario]
    });

  }




  public cancelar() {

    this.routerPrd.navigate(['/empleados']);
  }


  public enviarFormulario() {



    console.log(this.myForm.getRawValue());


    this.submitEnviado = true;

    let noesFecha: boolean = (this.myForm.controls.tipoContratoId.value == null || this.myForm.controls.tipoContratoId.value == 1 || this.myForm.controls.tipoContratoId.value == 10);
    if(this.myForm.value.tipoContratoId !== "10" && this.myForm.value.tipoContratoId !== "1"){
      this.myForm.controls.fechaFin.setErrors({required: true});
    }
    if (this.myForm.invalid) {
      let invalido: boolean = true;
      if (noesFecha) {
        for (let item in this.myForm.controls) {

          if (item == "fechaFin")
            continue;

          if (this.myForm.controls[item].invalid) {
            invalido = true;
            break;
          }
          invalido = false;
        }
      }

      if (invalido) {
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
      }
    }
    const titulo = "¿Deseas guardar cambios?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let obj = this.myForm.getRawValue();
        //Se verifica que tipo de jornada se selecciono
        let idTipoJornada = -1;
        for (let item of this.arregloJornadas) {
          if (obj.jornadaId == item.jornadaId) {
            idTipoJornada = item.tipoJornadaId;
            break;
          }
        }
        //******************************************* */


        if (obj.fechaAntiguedad != undefined && obj.fechaAntiguedad != '') {
          obj.fechaAntiguedad = new Date((new Date(obj.fechaAntiguedad).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }

        if (obj.fechaInicio != undefined && obj.fechaInicio != '') {
          obj.fechaInicio = new Date((new Date(obj.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }
        if (obj.fechaFin != undefined && obj.fechaFin != '') {
          obj.fechaFin = new Date((new Date(obj.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }

        if (obj.fechaAltaImss != undefined && obj.fechaAltaImss != '') {
          obj.fechaAltaImss = new Date((new Date(obj.fechaAltaImss).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }



        let objEnviar:any = {
          areaId: { areaId: obj.areaId },
          puestoId: { puestoId: obj.puestoId },
          politicaId: { politicaId: obj.politicaId },
          numEmpleado: obj.personaId,
          fechaAntiguedad: obj.fechaAntiguedad,
          tipoContratoId: { tipoContratoId: obj.tipoContratoId },
          fechaInicio: obj.fechaInicio,
          fechaContrato: obj.fechaInicio,
          fechaFin: obj.fechaFin,
          areaGeograficaId: { areaGeograficaId: obj.areaGeograficaId },
          grupoNominaId: { grupoNominaId: obj.grupoNominaId },
          tipoCompensacionId: { tipoCompensacionId: obj.tipoCompensacionId },
          tipoRegimenContratacionId: { tipoRegimenContratacionId: obj.tipoRegimenContratacionId },
          sueldoBrutoMensual: obj.sueldoBrutoMensual,
          salarioDiario: obj.salarioDiario,
          jornadaId: { jornadaId: obj.jornadaId },
          tipoJornadaId: idTipoJornada,
          personaId: { personaId: this.datosPersona.personaId },
          centrocClienteId: { centrocClienteId: this.id_empresa },
          estadoId: { estadoId: obj.estadoId },
          sbc: obj.sbc,
          sedeId: { sedeId: obj.sedeId },
          esSindicalizado: obj.esSindicalizado,
          diasVacaciones: obj.dias_vacaciones,
          metodoPagoId: { metodoPagoId: obj.metodo_pago_id },
          jefeInmediatoId: {
            personaId: this.puestoIdReporta == 0 ? null : this.puestoIdReporta
          },
          fechaAltaImss: obj.fechaAltaImss,
          sueldoNetoMensual: obj.sueldoNetoMensual
        }


        if(this.grupoNominaSeleccionado.pagoComplementario){
          objEnviar.pppSalarioBaseMensual = objEnviar.sueldoBrutoMensual;
          objEnviar.salarioNetoMensualImss=obj.salarioNetoMensualImss;
          objEnviar.pppMontoComplementario = obj.pagoComplementario;
          objEnviar.salarioDiarioIntegrado = obj.salarioDiarioIntegrado;
          objEnviar.sbc = obj.salarioDiarioIntegrado;
        }




        if (this.tabsDatos[3]?.fechaContrato == undefined) {
          this.guardarContratoColaborador(objEnviar);
        } else {
          this.actualizarContratoColaborador(objEnviar);
        }

      }
    });;

  }


  public actualizarContratoColaborador(objEnviar: any) {
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    objEnviar.fechaContrato = this.tabsDatos[3].fechaContrato;

    this.colaboradorPrd.update(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          let metodopago = {};

          for (let item of this.arregloMetodosPago) {

            if (item.metodoPagoId == this.myForm.value.metodo_pago_id) {

              metodopago = item;
              break;
            }

          }


          this.enviado.emit({ type: "empleo", datos: datos.datos, metodopago: metodopago });
        }
      });


    });
  }


  public guardarContratoColaborador(objEnviar: any) {




    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.colaboradorPrd.save(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          let metodopago = {};

          for (let item of this.arregloMetodosPago) {

            if (item.metodoPagoId == this.myForm.value.metodo_pago_id) {

              metodopago = item;
              break;
            }

          }


          this.enviado.emit({ type: "empleo", datos: datos.datos, metodopago: metodopago });
        }
      });


    });
  }

  public get f() {
    return this.myForm.controls;
  }


  public cambiaArea($event: any) {
    this.myForm.controls.puestoId.disable();


    this.apareceplusPuesto = true;

    this.textoArea = $event.target.options[$event.target.options.selectedIndex].text;


    this.arregloPuestos = [];
    this.areasPrd.getPuestoByArea(this.id_empresa, this.myForm.controls.areaId.value).subscribe(datos => {

      this.arregloPuestos = datos.datos;
      this.myForm.controls.puestoId.enable();
    });

  }


  public cambiarSueldoField() {



    this.sueldoBruto = this.myForm.controls.tiposueldo.value == 'b';
    this.sueldoNeto = this.myForm.controls.tiposueldo.value == 'n';

    this.myForm.controls.sueldoNetoMensual.setValidators([]);
    this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();
    this.myForm.controls.sueldoBrutoMensual.setValidators([]);
    this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();

    if (this.sueldoNeto) {


      this.myForm.controls.sueldoNetoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();


    }

    if (this.sueldoBruto) {
      this.myForm.controls.sueldoBrutoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();
    }


  }


  public cambiarStatus() {

    if (this.myForm.controls.esSubcontratado.value) {

      this.myForm.controls.subcontratistaId.setErrors({ required: true });
      this.myForm.controls.suPorcentaje.setErrors({ required: true });

    } else {
      this.myForm.controls.subcontratistaId.setErrors(null);
      this.myForm.controls.suPorcentaje.setErrors(null);
    }
  }


  public salirReportaA() {

    this.myForm.controls.puesto_id_reporta.setErrors(null);
    this.myForm.value.puestoIdReporta = undefined;
    const nombreCapturado = this.myForm.value.puesto_id_reporta;
    if (nombreCapturado !== undefined) {
      if (nombreCapturado?.trim() !== "") {
        let encontrado: boolean = false;
        let nombreCompleto = "";
        for (let item of this.arregloempleadosreporta) {

          nombreCompleto = item.personaId.nombre + " " + item.personaId.apellidoPaterno + " " + (item.personaId.apellidoMaterno == undefined ? "" : item.personaId.apellidoMaterno);

          if (nombreCompleto.includes(nombreCapturado)) {
            encontrado = true;
            this.puestoIdReporta = item.personaId.personaId;
            break;
          }
        }
        this.myForm.controls.puesto_id_reporta.setErrors({ require: true });
        if (encontrado) {
          this.myForm.controls.puesto_id_reporta.setErrors(null);
          this.myForm.controls.puesto_id_reporta.setValue(nombreCompleto);
        }
      }
    }
  }


  public validarFechaImss() {

    let fecha = this.myForm.controls.fechaAltaImss.value;
    if (fecha != undefined && fecha != '') {
      let fechaaux: Date = new Date((new Date(fecha).toUTCString()).replace(" 00:00:00 GMT", ""));
      try {



        if (!(this.myForm.controls.fechaAntiguedad.value !== '' && this.myForm.controls.fechaAntiguedad.value !== null)) {
          this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar la fecha de antigüedad");
        }
        let fechaAntiguedad: Date = new Date((new Date(this.myForm.controls.fechaAntiguedad.value).toUTCString()).replace(" 00:00:00 GMT", ""));

        if (!(fechaaux >= fechaAntiguedad)) {
          this.modalPrd.showMessageDialog(this.modalPrd.error, "La fecha del imss no puede ser menor a la fecha de antigüedad del empleado");
        }
      } catch {
        this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar la fecha de antigüedad");
      }
    }
  }

  public cambiarGrupoNomina() {
    const gruponominaId = this.myForm.controls.grupoNominaId.value;

    let aux;

    for (let item of this.arreglogruponominas) {
      if (item.id == gruponominaId) {
        aux = item;
        break;
      }

      aux = {
        pagoComplementario: false
      };
    }

    this.grupoNominaSeleccionado = aux;
    //this.grupoNominaSeleccionado.pagoComplementario = true;

    if (this.grupoNominaSeleccionado.pagoComplementario) {


      this.myForm.controls.salarioNetoMensualImss.disable();
      this.myForm.controls.pagoComplementario.disable();


      this.myForm.controls.tiposueldo.disable();
      this.myForm.controls.tiposueldo.setValue('n');


      this.myForm.controls.tipoCompensacionId.setValue(2);


      this.myForm.controls.salarioDiario.enable();

      this.myForm.controls.salarioDiario.setValidators([Validators.required]);
      this.myForm.controls.salarioDiario.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.setValidators([Validators.required]);
      this.myForm.controls.salarioDiarioIntegrado.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.disable();

      this.cambiarSueldoField();
    } else {
      this.myForm.controls.salarioDiario.setValidators([]);
      this.myForm.controls.salarioDiario.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.setValidators([]);
      this.myForm.controls.salarioDiarioIntegrado.updateValueAndValidity();


      this.myForm.controls.tiposueldo.enable();
      this.myForm.controls.salarioDiario.disable();

    }



  }


  public cambiasueldobruto(esBruto: boolean) {








    if (this.myForm.controls.sueldoBrutoMensual.invalid) {
      return;
    }

    if (this.myForm.controls.politicaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar una política");
      return;
    }
    if (this.myForm.controls.grupoNominaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar un grupo de  nómina");
      return;
    }
    if (this.myForm.controls.tipoCompensacionId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la compensación");
      return;
    }
    if (this.myForm.controls.fechaAntiguedad.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la fecha de antigüedad");
      return;
    }
    if (this.myForm.controls.fechaInicio.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la de inicio de contrato");
      return;
    }


    if(this.grupoNominaSeleccionado.pagoComplementario){
      if (this.myForm.controls.salarioDiario.invalid) {

        this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
        return;
      }
    }


    let objenviar:any = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
      politicaId: this.myForm.controls.politicaId.value,
      grupoNomina: this.myForm.controls.grupoNominaId.value,
      tipoCompensacion: this.myForm.controls.tipoCompensacionId.value,
      sbmImss: this.myForm.controls.sueldoBrutoMensual.value,
      pagoNeto: this.myForm.controls.sueldoNetoMensual.value,
      fechaAntiguedad: this.myForm.controls.fechaAntiguedad.value,
      fecIniPeriodo: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"),

    }

    if (esBruto) {
      delete objenviar.pagoNeto;
    } else {
      delete objenviar.sbmImss;
      objenviar.salarioDiario = this.myForm.controls.salarioDiario.value;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading, "Calculando");

    if (esBruto) {
      this.calculoPrd.calculoSueldoBruto(objenviar).subscribe(datos => {

        let aux = datos.datos;
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if (datos.datos !== undefined) {


          this.myForm.controls.salarioDiario.setValue(aux.salarioDiario);
          this.myForm.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
          this.myForm.controls.sueldoNetoMensual.setValue(aux.salarioNetoMensual);
        }
      });
    } else {

      if(this.grupoNominaSeleccionado.pagoComplementario){

        this.calculoPrd.calculoSueldoNetoPPP(objenviar).subscribe(datos => {

          let aux = datos.datos;
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if (datos.datos !== undefined) {
          
            this.myForm.controls.salarioDiarioIntegrado.setValue(aux.salarioDiarioIntegrado);
            this.myForm.controls.salarioNetoMensualImss.setValue(aux.salarioNetoMensualImss);
            this.myForm.controls.pagoComplementario.setValue(aux.pagoComplementario);
            this.myForm.controls.sueldoBrutoMensual.setValue(aux.sbmTrabajador);
            
  
          }
        });
      }else{
        //Se calcula sueldo neto a sueldo bruto.....
      }

    }

  }
}
