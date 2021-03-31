import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { DomicilioService } from 'src/app/modules/empleados/services/domicilio.service';
import { PreferenciasService } from 'src/app/modules/empleados/services/preferencias.service';


@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  @Output() enviado = new EventEmitter();
  @Input() datosPersona: any;
  @Input() arregloEnviar: any;
  @Input() tabsDatos:any;


  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public enviadoSubmitArea: boolean = false;
  public apareceplusPuesto: boolean = false;
  public textoArea: string = "";
  public mensajeModalito: string = "";
  public desabilitarinput: boolean = false;


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
  public fechaICorreta: boolean = false;
  public activaFechaFin: boolean = true;

  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;

  public id_empresa!: number;

  constructor(private formBuilder: FormBuilder, private gruponominaPrd: GruponominasService,
    private areasPrd: SharedAreasService, private politicasPrd: SharedPoliticasService,
    private empleadosPrd: EmpleadosService, private catalogosPrd: CatalogosService,
    private colaboradorPrd: ContratocolaboradorService,
    private usuarioSistemaPrd: UsuarioSistemaService,
    private jornadaPrd: JornadalaboralService, private sedesPrd: SharedSedesService,
    private modalPrd: ModalService, private puestosPrd: PuestosService,
    private domicilioPrd: DomicilioService, private preferenciasPrd: PreferenciasService) { }

  ngOnInit(): void {

    this.id_empresa = this.usuarioSistemaPrd.getIdEmpresa();

    this.obj = {};

    if(this.tabsDatos[2]!==undefined){
      this.myForm = this.createForm(this.tabsDatos[2]);
    }else{
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

  public validarfechAntiguedad(fecha:any){

    debugger;
      let fechaInicioContra = fecha;
      var fecha = fecha.split("-");
      this.fechaAntiguedad.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
      var today = new Date();
 
      if (this.fechaAntiguedad > today){
        
        this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la del día')
        .then(()=> {
          this.myForm.controls.fechaAntiguedad.setValue("");
          this.myForm.controls.fechaInicio.setValue("");
          this.fechaICorreta = true;
        });

      }else{
        this.myForm.controls.fechaInicio.setValue(fechaInicioContra);
      }
  }

  public validarfechaInicioCont(fecha:any){

    debugger;
      if(fecha != ""){
      var fecha = fecha.split("-");
      this.fechaIC.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
 
      this.fechaICorreta = true;
      
      }
  }

  public validarfechaFinCont(fecha:any){

    debugger;
      var fechaFC=new Date();
      var fecha = fecha.split("-");
      fechaFC.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
      if(this.fechaICorreta){
          if (fechaFC < this.fechaIC){
            
            this.modalPrd.showMessageDialog(false, 'La fecha debe ser mayor a la fecha incio de contrato')
            .then(()=> {
              this.myForm.controls.fechaFin.setValue("");
            });

          }
        }else{

          this.modalPrd.showMessageDialog(false, 'Bebe colocar una fecha incio de contrato ')
          .then(()=> {
            this.myForm.controls.fechaFin.setValue("");
          });
        }
  }

  public validartipoContrato(idContrato: any){
    debugger;
    if(idContrato == 1){
      this.activaFechaFin = false;
    }
    else if(idContrato == 10){
      this.activaFechaFin = false;
    }else{
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

            console.log("Este es el area", datos.datos);

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

            console.log("Este es el pusto", datos.datos);
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
    return this.formBuilder.group({
      areaId: [obj.areaId, [Validators.required]],
      puestoId: [{ value: obj.puestoId, disabled: true }, [Validators.required]],
      puesto_id_reporta: [obj.puesto_id_reporta],
      sedeId: [obj.sedeId],
      estadoId: [obj.estadoId,[Validators.required]],
      politicaId: [obj.politicaId, [Validators.required]],
      personaId: [this.datosPersona.personaId, [Validators.required]],
      esSindicalizado: ['false'],
      fechaAntiguedad: [obj.fechaAntiguedad, [Validators.required]],
      tipoContratoId: [obj.tipoContratoId, [Validators.required]],
      fechaInicio: [obj.fechaInicio, Validators.required],
      fechaFin: [{ value: obj.fechaFin, disabled: false }, [Validators.required]],
      jornadaId: [obj.jornadaId, [Validators.required]],
      grupoNominaId: [obj.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: 0,
      sueldoNetoMensual: 0,
      salarioDiario: [0, [Validators.required]],
      dias_vacaciones: [obj.dias_vacaciones, [Validators.required]],
      metodo_pago_id: [obj.metodo_pago_id, [Validators.required]],
      tipoRegimenContratacionId: [obj.tipoRegimenContratacionId, [Validators.required]],
      areaGeograficaId: [obj.areaGeograficaId, [Validators.required]],
      esSubcontratado: [obj.esSubcontratado],
      suPorcentaje: [obj.suPorcentaje],
      tiposueldo: ['b', [Validators.required]],
      subcontratistaId: obj.subcontratistaId,
      puestoIdReporta:obj.puestoIdReporta

    });

  }




  public cancelar() {




  }


  public enviarFormulario() {



    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }






    const titulo = "¿Deseas guardar cambios?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let obj = this.myForm.value;
        //Se verifica que tipo de jornada se selecciono
        let idTipoJornada = -1;
        for (let item of this.arregloJornadas) {
          if (obj.jornadaId == item.jornadaId) {
            idTipoJornada = item.tipoJornadaId;
            break;
          }
        }
        //******************************************* */


        if(obj.fechaAntiguedad != undefined || obj.fechaAntiguedad != ''){
          obj.fechaAntiguedad = new Date((new Date(obj.fechaAntiguedad).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }

        if(obj.fechaInicio != undefined || obj.fechaInicio != ''){
          obj.fechaInicio = new Date((new Date(obj.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }
        if(obj.fechaFin != undefined || obj.fechaFin != ''){
          obj.fechaFin = new Date((new Date(obj.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        }

        let objEnviar = {
          areaId: { areaId: obj.areaId },
          puestoId: { puestoId: obj.puestoId },
          politicaId: { politicaId: obj.politicaId },
          numEmpleado: obj.personaId,
          fechaAntiguedad: obj.fechaAntiguedad,
          tipoContratoId: { tipoContratoId: obj.tipoContratoId },
          fechaInicio: obj.fechaInicio,
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
          esSubcontratado: obj.esSubcontratado == null ? false : obj.esSubcontratado,
          sbc: obj.salarioDiario,
          sedeId: { sedeId: obj.sedeId },
          esSindicalizado: obj.esSindicalizado,
          diasVacaciones: obj.dias_vacaciones,
          metodoPagoId: { metodoPagoId: obj.metodo_pago_id },
          porcentaje: obj.suPorcentaje,
          subcontratistaId: { subcontratistaId: obj.subcontratistaId },
          jefeInmediatoId:{
            personaId:obj.puestoIdReporta
            }
        }


        console.log("Esto se manda como persona", this.arregloEnviar[0]);



        if(this.datosPersona.personaId === undefined){
          this.empleadosPrd.save(this.arregloEnviar[0]).subscribe(valorEmpleado => {

            if (!valorEmpleado.resultado) {
              this.modalPrd.showMessageDialog(valorEmpleado.resultado, valorEmpleado.mensaje);
              return;
            }
  
            this.datosPersona.personaId = {
              personaId:  valorEmpleado.datos.personaId
            }  
            objEnviar.personaId.personaId = valorEmpleado.datos.personaId;
  
            this.guardarContratoColaborador(objEnviar,valorEmpleado);
  
          });
        }else{
          this.empleadosPrd.update(this.datosPersona).subscribe(valorEmpleado =>{

            if (!valorEmpleado.resultado) {
              this.modalPrd.showMessageDialog(valorEmpleado.resultado, valorEmpleado.mensaje);
              return;
            }

            this.datosPersona.personaId.personaId  = valorEmpleado.datos.personaId;
            objEnviar.personaId.personaId = valorEmpleado.datos.personaId;
  
            this.guardarContratoColaborador(objEnviar,valorEmpleado);



          });
        }
      







      }
    });;

  }


  public guardarContratoColaborador(objEnviar:any,valorEmpleado:any){
    this.colaboradorPrd.save(objEnviar).subscribe(datos => {
              
              
      let domicilio = this.arregloEnviar[1];
      //let preferencias = this.arregloEnviar[2];
      domicilio.personaId.personaId = objEnviar.personaId.personaId;
      // preferencias.personaId = valorEmpleado.personaId;

      this.domicilioPrd.save(domicilio).toPromise();
      // this.preferenciasPrd.save(preferencias).toPromise();

      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          let metodopago = {};

          for (let item of this.arregloMetodosPago) {

            if (item.metodoPagoId == this.myForm.value.metodo_pago_id) {

              metodopago = item;
              break;
            }

          }

          let datosPersona = valorEmpleado.datos;
          datosPersona.metodopago = metodopago;
          datosPersona.contratoColaborador = datos.datos;

          this.enviado.emit({ type: "empleo", datos: datosPersona });
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
    console.log(this.myForm.controls.areaId.value);
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

    this.myForm.controls.sueldoBrutoMensual.setErrors(null);
    this.myForm.controls.sueldoNetoMensual.setErrors(null);

    if (this.sueldoNeto) {


      this.myForm.controls.sueldoNetoMensual.setErrors({ required: true });

    }

    if (this.sueldoBruto) {
      this.myForm.controls.sueldoBrutoMensual.setErrors({ required: true });


    }

    console.log();
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
      if (nombreCapturado.trim() !== "") {
        let encontrado: boolean = false;
        for (let item of this.arregloempleadosreporta) {
          console.log(item);
          const nombreCompleto = item.personaId.nombre + " " + item.personaId.apellidoPaterno;
          console.log("Este es el nombre completo", nombreCompleto);
          console.log("Este es el nombre capturado", nombreCapturado);
          if (nombreCompleto.includes(nombreCapturado)) {
            encontrado = true;
            this.myForm.value.puestoIdReporta = item.personaId.personaId;
            break;
          }
        }
        this.myForm.controls.puesto_id_reporta.setErrors({ require: true });
        if (encontrado) {
          this.myForm.controls.puesto_id_reporta.setErrors(null);
        }
      }
    }
  }
}
