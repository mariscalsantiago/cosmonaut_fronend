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
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';




@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  @ViewChild("fechaAntiguedad") fechaAntiguedadElemento!: ElementRef;
  @ViewChild("fechaInicioCont") fechaInicioCont!: ElementRef;
  @ViewChild("fechaFinCont") fechaFinCont!: ElementRef;
  @ViewChild("sueldoppp") sueldoppp!: ElementRef;
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
  public calculoEfectuado: boolean = false;

  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;

  public id_empresa!: number;


  public typeppp: boolean = false;

  constructor(private formBuilder: FormBuilder, private routerPrd: Router, private gruponominaPrd: GruponominasService,
    private areasPrd: SharedAreasService, private politicasPrd: SharedPoliticasService,
    private empleadosPrd: EmpleadosService, private catalogosPrd: CatalogosService,
    private colaboradorPrd: ContratocolaboradorService,
    private usuarioSistemaPrd: UsuarioSistemaService,
    private jornadaPrd: JornadalaboralService, private sedesPrd: SharedSedesService,
    private modalPrd: ModalService, private puestosPrd: PuestosService,
    private calculoPrd: CalculosService, private usuariosAuth: UsuariosauthService) { }

  ngOnInit(): void {








    this.id_empresa = this.usuarioSistemaPrd.getIdEmpresa();

    this.obj = {};

    if (this.tabsDatos[3] !== undefined) {
      this.myForm = this.createForm(this.tabsDatos[3]);

      this.areasPrd.getPuestoByArea(this.id_empresa, this.myForm.controls.areaId.value).subscribe(datos => {

        this.arregloPuestos = datos.datos;
        this.myForm.controls.puestoId.enable();
      });

    } else {
      this.myForm = this.createForm(this.obj);
    }
    this.cambiarSueldoField();

    this.gruponominaPrd.getAll(this.id_empresa).subscribe(datos => {
      this.arreglogruponominas = datos.datos;
      this.cambiarGrupoNomina(true);
      if (this.typeppp) {
        this.myForm.controls.sueldonetomensualppp.setValue(this.tabsDatos[3].pppSnm || 0);
        this.myForm.controls.salarioDiarioIntegrado.setValue(this.tabsDatos[3].sbc);
        this.myForm.controls.salarioNetoMensualImss.setValue(this.tabsDatos[3].sueldoNetoMensual);
        this.myForm.controls.pagoComplementario.setValue(this.tabsDatos[3].pppMontoComplementario);

      }
    });

    this.areasPrd.getAreasByEmpresa(this.id_empresa).subscribe(datos => this.arregloArea = datos.datos || []);
    this.politicasPrd.getPoliticasByEmpresa(this.id_empresa).subscribe(datos => this.arregloPoliticas = datos.datos);
    this.empleadosPrd.getEmpleadosCompaniaJefe(this.id_empresa).subscribe(datos => {
      this.arregloempleadosreporta.push(datos)
    });
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

    this.myForm.value;

    this.myForm.controls.sueldoBrutoMensual.valueChanges.subscribe(valor => {
    });
    this.myForm.controls.fechaAntiguedad.valueChanges.subscribe(valor => {
      this.fechaInicioCont.nativeElement.min = valor;
    });

    this.myForm.controls.fechaInicio.valueChanges.subscribe(valor => {
      this.fechaFinCont.nativeElement.min = valor;
    });


    this.myForm.controls.fechaAntiguedad.valueChanges.subscribe(valor => {

      let fechaInicioContra = valor;
      let fecha = valor.split("-");
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
    });



    this.myForm.controls.tipoContratoId.valueChanges.subscribe((idContrato: number) => {
      this.activaFechaFin = idContrato != 1 && idContrato != 10;
      if (this.activaFechaFin)
        this.myForm.controls.fechaFin.setValidators([Validators.required]);
      else
        this.myForm.controls.fechaFin.clearValidators();
      this.myForm.controls.fechaFin.updateValueAndValidity();
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


  }

  public validarfechaInicioCont(fecha: any) {



    if (Boolean(fecha)) {
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

  public validarfechaFinCont() {




    let fechaFin: Date = new Date(this.myForm.controls.fechaFin.value);
    let fechaInicio: Date = new Date(this.myForm.controls.fechaInicio.value);

    if (this.myForm.controls.fechaInicio.value) {
      if (fechaFin < fechaInicio) {

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
          this.modalPrd.showMessageDialog(this.modalPrd.loading);

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
      puesto_id_reporta: [`${obj.jefeInmediatoId?.nombre || ''} ${obj.jefeInmediatoId?.apellidoPaterno || ''} ${obj.jefeInmediatoId?.apellidoMaterno || ''}`.trim()],
      sedeId: [obj.sedeId?.sedeId],
      estadoId: [obj.estadoId?.estadoId, [Validators.required]],
      politicaId: [obj.politicaId?.politicaId, [Validators.required]],
      personaId: [this.datosPersona.personaId, [Validators.required]],
      esSindicalizado: [obj.esSindicalizado || 'false'],
      fechaAntiguedad: [obj.fechaAntiguedad, [Validators.required]],
      tipoContratoId: [obj.tipoContratoId?.tipoContratoId, [Validators.required]],
      fechaInicio: [obj.fechaInicio, Validators.required],
      fechaFin: [{ value: obj.fechaFin, disabled: false }],
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
      fechaAltaImss: [obj.fechaAltaImss],
      sbc: [{ value: obj.sbc, disabled: true }],
      salarioDiarioIntegrado: [obj.salarioDiarioIntegrado, []],
      salarioNetoMensualImss: [obj.salarioNetoMensualImss],
      pagoComplementario: [obj.pagoComplementario],
      sueldonetomensualppp: [obj.sueldonetomensualppp],
      sueldoBrutoMensualPPP: [{ value: obj.pppSalarioBaseMensual, disabled: true }]
    });

  }




  public cancelar() {

    this.routerPrd.navigate(['/empleados']);
  }


  public enviarFormulario() {

    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      })
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }
    if (!this.calculoEfectuado) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "No se ha realizado el cálculo de sueldo");
      return;

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
        let objEnviar: any = {
          ...this.tabsDatos[3],
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

        if (this.grupoNominaSeleccionado.pagoComplementario) {

          objEnviar.sueldoNetoMensual = obj.salarioNetoMensualImss; //Pago imss
          delete obj.salarioNetoMensualImss;
          objEnviar.pppMontoComplementario = obj.pagoComplementario; //Pago complementario
          objEnviar.sbc = obj.salarioDiarioIntegrado; //Sañario integrado
          delete obj.salarioDiarioIntegrado;
          objEnviar.pppSalarioBaseMensual = obj.sueldoBrutoMensualPPP;//sueldo menusal ppp
          objEnviar.pppSnm = obj.sueldonetomensualppp;
        }


        if (this.tabsDatos[3]?.fechaContrato == undefined) {
          this.guardarContratoColaborador(objEnviar);
        } else {
          if (!Boolean(objEnviar.jefeInmediatoId.personaId)) {
            objEnviar.jefeInmediatoId = null;
          }

          if (!Boolean(objEnviar.sedeId.sedeId)) {
            objEnviar.sedeId = null;
          }

          objEnviar.fechaContrato = this.tabsDatos[3]?.fechaContrato;
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



    console.log(JSON.stringify(objEnviar));


    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.colaboradorPrd.save(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);



      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {



          let objAuthEnviar = {
            nombre: this.datosPersona.nombre,
            apellidoPat: this.datosPersona.apellidoPaterno,
            apellidoMat: this.datosPersona.apellidoMaterno,
            email: this.datosPersona.emailCorporativo,
            centrocClienteIds: [this.usuarioSistemaPrd.getIdEmpresa()],
            rolId: 2,
            version: this.usuarioSistemaPrd.getVersionSistema()
          }

          this.usuariosAuth.guardar(objAuthEnviar).subscribe(vv => {
            if (!vv.resultado) {
              this.modalPrd.showMessageDialog(vv.resultado, vv.mensaje);
            }
          });

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

    this.myForm.controls.puesto_id_reporta.clearValidators();
    this.myForm.controls.puesto_id_reporta.updateValueAndValidity();
    this.puestoIdReporta = 0;
    const nombreCapturado = this.myForm.value.puesto_id_reporta;
    if (nombreCapturado) {
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
    } else {
      this.myForm.controls.puesto_id_reporta.clearValidators();
      this.myForm.controls.puesto_id_reporta.updateValueAndValidity();
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

  public cambiarGrupoNomina(noRestablecer: boolean) {
    const gruponominaId = this.myForm.controls.grupoNominaId.value;


    let aux = this.pagoComplementario(gruponominaId);



    if (!noRestablecer) {
      this.limpiarMontos();

    }

    this.grupoNominaSeleccionado = aux;
    //this.grupoNominaSeleccionado.pagoComplementario = true;

    if (this.grupoNominaSeleccionado.pagoComplementario) {

      this.myForm.controls.sueldonetomensualppp.setValidators([Validators.required]);
      this.myForm.controls.sueldonetomensualppp.updateValueAndValidity();

      this.typeppp = true;
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


      this.myForm.controls.sueldonetomensualppp.clearValidators();
      this.myForm.controls.sueldonetomensualppp.updateValueAndValidity();
      this.typeppp = false;
      this.myForm.controls.salarioDiario.setValidators([]);
      this.myForm.controls.salarioDiario.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.setValidators([]);
      this.myForm.controls.salarioDiarioIntegrado.updateValueAndValidity();


      this.myForm.controls.tiposueldo.enable();
      this.myForm.controls.salarioDiario.disable();

    }



  }

  public pagoComplementario(gruponominaId: number) {
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

    return aux;
  }


  public cambiasueldobruto(esBruto: boolean) {


    if (this.verificaCambiosNecesarios()) return;

    if (this.grupoNominaSeleccionado.pagoComplementario) {
      if (this.myForm.controls.salarioDiario.invalid) {

        this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
        return;
      }
    } else {
      if (this.myForm.controls.sueldoBrutoMensual.invalid) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, "Falta sueldo bruto mensual");
        return;
      }
    }
    let objenviar: any = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
      politicaId: this.myForm.controls.politicaId.value,
      grupoNomina: this.myForm.controls.grupoNominaId.value,
      tipoCompensacion: this.myForm.controls.tipoCompensacionId.value,
      sbmImss: this.myForm.controls.sueldoBrutoMensual.value,
      pagoNeto: this.myForm.controls.sueldoNetoMensual.value,
      fechaAntiguedad: this.myForm.controls.fechaAntiguedad.value,
      fecIniPeriodo: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
    }




    this.modalPrd.showMessageDialog(this.modalPrd.loading, "Calculando");

    if (esBruto) {
      delete objenviar.pagoNeto;
      this.calculoPrd.calculoSueldoBruto(objenviar).subscribe(datos => {

        let aux = datos.datos;
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if (datos.resultado) {
          if (datos.datos !== undefined) {
            this.myForm.controls.salarioDiario.setValue(aux.salarioDiario);
            this.myForm.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
            this.myForm.controls.sueldoNetoMensual.setValue(aux.salarioNetoMensual);
            this.calculoEfectuado = true;
          }
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }

      });
    } else {
      console.warn("SE VA A CALCULAR EL SUELDO NETO MENSUAL A BRUTO MENSUAL");

      let objenviarMensual = {
        centroClienteId: this.usuarioSistemaPrd.getIdEmpresa(),
        politicaId: this.myForm.controls.politicaId.value,
        grupoNominaId: this.myForm.controls.grupoNominaId.value,
        periodicidadId: "05",
        sueldoNeto: this.myForm.controls.sueldoNetoMensual.value,
        fechaAntiguedad: this.myForm.controls.fechaAntiguedad.value,
        fechaInicio: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
      };


      this.calculoPrd.calculoSueldoNetoabruto(objenviarMensual).subscribe(datos => {

        let aux = datos.datos;
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if (datos.resultado) {
          if (datos.datos !== undefined) {
            this.myForm.controls.salarioDiario.setValue(aux.salarioDiario);
            this.myForm.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
            this.myForm.controls.sueldoBrutoMensual.setValue(aux.salarioBrutoMensual);
            this.calculoEfectuado = true;
          }
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }

      });



    }

  }


  public cambiassueldoPPP() {

    if (this.verificaCambiosNecesarios()) return;

    if (this.myForm.controls.sueldonetomensualppp.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el sueldo neto PPP");
      return;
    }

    if (this.myForm.controls.salarioDiario.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
      return;
    }


    let objenviar: any = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa(),
      politicaId: this.myForm.controls.politicaId.value,
      grupoNomina: this.myForm.controls.grupoNominaId.value,
      tipoCompensacion: this.myForm.controls.tipoCompensacionId.value,
      pagoNeto: this.myForm.controls.sueldonetomensualppp.value,
      fechaAntiguedad: this.myForm.controls.fechaAntiguedad.value,
      fechaContrato: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"),
      sdImss: this.myForm.controls.salarioDiario.value
    }



    //*************calculo PPP *******************+ */

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.calculoPrd.calculoSueldoNetoPPP(objenviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      let aux = datos.datos;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      if (datos.resultado) {
        if (datos.datos !== undefined) {

          this.myForm.controls.salarioDiarioIntegrado.setValue(aux.sbc);
          this.myForm.controls.salarioNetoMensualImss.setValue(aux.sueldoNetoMensual);
          this.myForm.controls.sueldoNetoMensual.setValue(aux.sueldoNetoMensual);
          this.myForm.controls.sueldoBrutoMensual.setValue(aux.sueldoBrutoMensual);
          this.myForm.controls.pagoComplementario.setValue(aux.pppMontoComplementario);
          this.myForm.controls.sueldoBrutoMensualPPP.setValue(aux.pppSbm);
          this.calculoEfectuado = true;
        }
      } else {
        this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
        return;
      }
    });

  }


  public verificaCambiosNecesarios(): boolean {
    let variable: boolean = false;

    if (this.myForm.controls.politicaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar una política");
      variable = true;
    }
    if (this.myForm.controls.grupoNominaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar un grupo de  nómina");
      variable = true;
    }
    if (this.myForm.controls.tipoCompensacionId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la compensación");
      variable = true;
    }
    if (this.myForm.controls.fechaAntiguedad.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la fecha de antigüedad");
      variable = true;
    }
    if (this.myForm.controls.fechaInicio.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar el inicio de contrato");
      variable = true;
    }

    return variable;
  }


  public limpiarMontos() {
    this.myForm.controls.tipoCompensacionId.setValue("");
    this.myForm.controls.tiposueldo.setValue("b");
    this.myForm.controls.sueldoNetoMensual.setValue("");
    this.myForm.controls.sueldoBrutoMensual.setValue("");
    this.myForm.controls.sueldonetomensualppp.setValue("");
    this.myForm.controls.salarioDiario.setValue("");
    this.myForm.controls.salarioDiarioIntegrado.setValue("");
    this.myForm.controls.sbc.setValue("");
    this.myForm.controls.salarioNetoMensualImss.setValue("");
    this.myForm.controls.pagoComplementario.setValue("");
    this.myForm.controls.sueldoBrutoMensualPPP.setValue("");

    this.cambiarSueldoField();

  }





  public calcularsueldo() {

    if (!this.grupoNominaSeleccionado.pagoComplementario) {
      this.cambiasueldobruto(this.f.tiposueldo.value == 'b');
    } else {
      this.cambiassueldoPPP();
    }
  }
}
