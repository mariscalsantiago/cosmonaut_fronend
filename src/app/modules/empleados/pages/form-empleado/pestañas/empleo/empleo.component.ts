import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedPoliticasService } from 'src/app/shared/services/politicas/shared-politicas.service';


@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosPersona: any;

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglogruponominas: any = [];
  public arregloArea: any = [];
  public arregloPuestos: any = [];
  public arregloPoliticas: any = [];
  public arregloempleadosreporta: any = [];
  public arregloCompensacion: any = [];
  public arregloareasgeograficas: any = [];

  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;

  public id_empresa: number = 112;

  constructor(private formBuilder: FormBuilder, private gruponominaPrd: GruponominasService,
    private areasPrd: SharedAreasService, private politicasPrd: SharedPoliticasService,
    private empleadosPrd: EmpleadosService, private catalogosPrd: CatalogosService,
    private colaboradorPrd: ContratocolaboradorService) { }

  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);

    this.gruponominaPrd.getAll(112).subscribe(datos => {
      this.arreglogruponominas = datos.datos
      console.log(this.arreglogruponominas);
    });

    this.areasPrd.getAreasByEmpresa(this.id_empresa).subscribe(datos => this.arregloArea = datos.datos);
    this.politicasPrd.getPoliticasByEmpresa(1).subscribe(datos => this.arregloPoliticas = datos.datos);
    this.empleadosPrd.getEmpleadosCompania(40).subscribe(datos => this.arregloempleadosreporta = datos.datos);
    this.catalogosPrd.getCompensacion().subscribe(datos => this.arregloCompensacion = datos.datos);
    this.catalogosPrd.getAreasGeograficas().subscribe(datos => this.arregloareasgeograficas = datos.datos);


  }

  public createForm(obj: any) {
    return this.formBuilder.group({
      areaId: [obj.areaId, [Validators.required]],
      puestoId: [{value:obj.puestoId,disabled:true}, [Validators.required]],
      puesto_id_reporta: [obj.puesto_id_reporta],
      sedeId: [obj.sedeId],
      estadoId: [obj.estadoId],
      politicaId: [obj.politicaId, [Validators.required]],
      personaId: [this.datosPersona.personaId, [Validators.required]],
      esSindicalizado: [obj.esSindicalizado],
      fechaAntiguedad: [obj.fechaAntiguedad,[Validators.required]],
      tipoContratoId: [obj.tipoContratoId,[Validators.required]],
      fechaInicio: [obj.fechaInicio,Validators.required],
      fechaFin: [obj.fechaFin,[Validators.required]],
      jornadaId: [obj.jornadaId,[Validators.required]],
      grupoNominaId: [obj.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: [obj.sueldoBrutoMensual],
      sueldoNetoMensual: [obj.sueldoNetoMensual],
      salarioDiario: [obj.salarioDiario, [Validators.required]],
      dias_vacaciones: [obj.dias_vacaciones, [Validators.required]],
      metodo_pago_id: [obj.metodo_pago_id, [Validators.required]],
      tipoRegimenContratacionId: [obj.tipoRegimenContratacionId, [Validators.required]],
      areaGeograficaId: [obj.areaGeograficaId, [Validators.required]],
      esSubcontratado: [obj.esSubcontratado],
      suPorcentaje: [obj.suPorcentaje],
      tiposueldo: [obj.tiposueldo, [Validators.required]],
      sueldonetomensual: obj.sueldonetomensual,
      subcontratistaId:obj.subcontratistaId

    });

  }




  public cancelar() {




  }


  public enviarFormulario() {

    console.log(this.myForm.value);

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o invalidos";
      this.alerta.strsubtitulo = "Hay campos invalidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;


      let obj = this.myForm.value;

      let objenviar = {
        areaId: {
          areaId: obj.areaId
        },
        puestoId: {
          puestoId: obj.puestoId
        },
        politicaId: {
          politicaId: obj.politicaId
        },
        numEmpleado: obj.personaId,
        fechaAntiguedad: obj.fechaAntiguedad,
        tipoContratoId: {
          tipoContratoId: obj.tipoContratoId
        },
        fechaInicio: obj.fechaInicio,
        fechaFin: obj.fechaFin,
        grupoNominaId: {
          grupoNominaId: obj.grupoNominaId
        },
        tipoCompensacionId: {
          tipoCompensacionId: obj.tipoCompensacionId
        },
        tipoRegimenContratacionId: {
          tipoRegimenContratacionId: obj.tipoRegimenContratacionId
        },
        sueldoBrutoMensual: obj.sueldoBrutoMensual,
        salarioDiario: obj.salarioDiario,
        jornadaId: {
          jornadaId: 1
        },
        personaId: {
          personaId: this.datosPersona.personaId
        },
        centrocClienteId: {
          centrocClienteId: 112
        },
        estadoId: {
          estadoId: obj.estadoId
        },
        esSubcontratado: obj.esSubcontratado,
        sedeId: {
          sedeId: obj.sedeId
        },
        esSindicalizado: obj.esSindicalizado,
        areaGeograficaId: {
          areaGeograficaId: obj.areaGeograficaId
        },
        suPorcentaje: obj.suPorcentaje
      }

      this.colaboradorPrd.save(objenviar).subscribe(datos => {

        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;

      });



    }
  }

  public cambiaArea() {
    this.myForm.controls.puestoId.disable();

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
    this.myForm.controls.sueldonetomensual.setErrors(null);

    if (this.sueldoNeto) {

      this.myForm.controls.sueldonetomensual.setErrors({ required: true });

    }

    if (this.sueldoBruto) {
      this.myForm.controls.sueldoBrutoMensual.setErrors({ required: true });
    }
  }


  public cambiarStatus(){

    console.log(this.myForm.controls.esSubcontratado.value);
    if(this.myForm.controls.esSubcontratado.value){

      this.myForm.controls.subcontratistaId.setErrors({required:true});
      this.myForm.controls.suPorcentaje.setErrors({required:true});

    }else{
      this.myForm.controls.subcontratistaId.setErrors(null);
      this.myForm.controls.suPorcentaje.setErrors(null);
    }
  }
}
