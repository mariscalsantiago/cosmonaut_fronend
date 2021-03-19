import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { JornadalaboralService } from 'src/app/modules/empresas/pages/submodulos/jonadaLaboral/services/jornadalaboral.service';
import { PuestosService } from 'src/app/modules/empresas/pages/submodulos/puestos/pages/services/puestos.service';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
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
  @Input() arregloEnviar:any;


  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public enviadoSubmitArea: boolean = false;
  public apareceplusPuesto: boolean = false;
  public textoArea: string = "";
  public mensajeModalito: string = "";
  public desabilitarinput:boolean = false;


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
    private domicilioPrd:DomicilioService,private preferenciasPrd:PreferenciasService) { }

  ngOnInit(): void {

    this.id_empresa = this.usuarioSistemaPrd.getIdEmpresa();

    let obj = {};
    this.myForm = this.createForm(obj);
    this.cambiarSueldoField();

    this.gruponominaPrd.getAll(this.id_empresa).subscribe(datos => {
      this.arreglogruponominas = datos.datos
    });

    this.areasPrd.getAreasByEmpresa(this.id_empresa).subscribe(datos => this.arregloArea = datos.datos);
    this.politicasPrd.getPoliticasByEmpresa(this.id_empresa).subscribe(datos => this.arregloPoliticas = datos.datos);
    this.empleadosPrd.getEmpleadosCompania(this.id_empresa).subscribe(datos => this.arregloempleadosreporta = datos.datos);
    this.catalogosPrd.getCompensacion().subscribe(datos => this.arregloCompensacion = datos.datos);
    this.catalogosPrd.getAreasGeograficas().subscribe(datos => this.arregloareasgeograficas = datos.datos);
    this.catalogosPrd.getTipoContratos().subscribe(datos => this.arregloTipoContrato = datos.datos);
    this.jornadaPrd.jornadasByEmpresa(this.id_empresa).subscribe(datos => this.arregloJornadas = datos.datos);
    this.sedesPrd.getsedeByEmpresa(this.id_empresa).subscribe(datos => this.arregloSedes = datos.datos);
    this.catalogosPrd.getTipoRegimencontratacion().subscribe(datos => this.arregloRegimenContratacion = datos.datos);
    this.catalogosPrd.getAllEstados().subscribe(datos => this.arregloEstados = datos.datos);
    this.catalogosPrd.getAllMetodosPago().subscribe(datos => this.arregloMetodosPago = datos.datos);





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
      subcontratistaId: obj.subcontratistaId

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

        let objEnviar = {
          areaId: { areaId: obj.areaId },
          puestoId: { puestoId: obj.puestoId },
          politicaId: { politicaId: obj.politicaId },
          numEmpleado: obj.personaId,
          fechaAntiguedad: new Date(obj.fechaAntiguedad).getTime(),
          tipoContratoId: { tipoContratoId: obj.tipoContratoId },
          fechaInicio: new Date(obj.fechaInicio).getTime(),
          fechaFin: new Date(obj.fechaFin).getTime(),
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
          subcontratistaId: { subcontratistaId: obj.subcontratistaId }
        }


        console.log("Esto se manda como persona",this.arregloEnviar[0]);


        this.empleadosPrd.save(this.arregloEnviar[0]).subscribe(valorEmpleado =>{
          
           if(!valorEmpleado.resultado){
             this.modalPrd.showMessageDialog(valorEmpleado.resultado,valorEmpleado.mensaje);
             return;
           }

           objEnviar.personaId.personaId = valorEmpleado.datos.personaId;



           console.log("SI SE PUDO ");

           console.log("Se va a mandar contrato colaborador",objEnviar);
           this.colaboradorPrd.save(objEnviar).subscribe(datos => {

            let domicilio = this.arregloEnviar[1];
           //let preferencias = this.arregloEnviar[2];
            domicilio.personaId.personaId = valorEmpleado.datos.personaId;
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

        });

        





      }
    });;

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
}
