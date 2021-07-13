import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { JornadalaboralService } from 'src/app/modules/empresas/pages/submodulos/jonadaLaboral/services/jornadalaboral.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { SharedPoliticasService } from 'src/app/shared/services/politicas/shared-politicas.service';
import { SharedSedesService } from 'src/app/shared/services/sedes/shared-sedes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';



@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {

  public editarcampos: boolean = false;
  public today = new Date((new Date(new Date).toUTCString()).replace(" 00:00:00 GMT", ""));
  public date !: any;
  public myForm!: FormGroup;
  public idEmpleado!: number;

  public empleado: any = {};
  public arregloArea: any = [];
  public arregloPuestos: any = [];
  public arregloempleadosreporta: any = [];
  public arregloRegimenContratacion: any = [];
  public arregloSedes: any = [];
  public arregloEstados: any = [];
  public arregloJornadas: any = [];
  public arregloPoliticas: any = [];
  public fechaIC: Date = new Date();
  public fechaAntiguedad: Date = new Date();
  public arregloareasgeograficas: any = [];
  public contratoDesc : string | undefined;

  public arregloTipoContrato: any = [];

  public puestoIdReporta:number = 0;

  constructor(private formBuilder: FormBuilder, private contratoColaboradorPrd: ContratocolaboradorService,
    private router: ActivatedRoute, public catalogosPrd: CatalogosService,
    private areasPrd: SharedAreasService, private usuariosSistemaPrd: UsuarioSistemaService,
    private empleadosPrd: EmpleadosService, private sedesPrd: SharedSedesService, private jornadaPrd: JornadalaboralService, private politicasPrd: SharedPoliticasService,
    private modalPrd: ModalService) { }

  ngOnInit() {
    
 // document.getElementById('fechantiguefa')
 //document.getElementById('fechaantiguedad')?.setAttribute("min", String(this.date));

 this.catalogosPrd.getAreasGeograficas(true).subscribe(datos => this.arregloareasgeograficas = datos.datos);
 this.catalogosPrd.getTipoContratos(true).subscribe(datos => this.arregloTipoContrato = datos.datos);
 this.catalogosPrd.getTipoRegimencontratacion(true).subscribe(datos => this.arregloRegimenContratacion = datos.datos);
 this.areasPrd.getAreasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloArea = datos.datos);
 this.empleadosPrd.getEmpleadosCompania(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
   this.arregloempleadosreporta = datos.datos
   
 });
 this.sedesPrd.getsedeByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloSedes = datos.datos);
 this.catalogosPrd.getAllEstados(true).subscribe(datos => this.arregloEstados = datos.datos);
 this.jornadaPrd.jornadasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloJornadas = datos.datos);
 this.politicasPrd.getPoliticasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloPoliticas = datos.datos);
 


    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];

      this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;
        this.contratoDesc = this.arregloTipoContrato.find((item:any) => item.tipoContratoId === this.empleado.tipoContratoId.tipoContratoId)?.descripcion;
        
        this.myForm = this.createForm(this.empleado);
        this.suscripciones();
        this.cambiaArea();
        
      });;
    });
    this.myForm = this.createForm(this.empleado);
    this.suscripciones();

  }

  public suscripciones(){
    this.myForm.controls.tipoContratoId.valueChanges.subscribe((idContrato:number) =>{
      console.log("SI se suscribe todo este show");
      
      if (idContrato != 1 && idContrato != 10)
        this.myForm.controls.fechaFin.setValidators([Validators.required]);
      else
        this.myForm.controls.fechaFin.clearValidators();
      this.myForm.controls.fechaFin.updateValueAndValidity();
    });
  }



  public createForm(obj: any) {
    let datePipe = new DatePipe("en-MX");

    this.date = datePipe.transform(this.today, 'yyyy-MM-dd');

    return this.formBuilder.group({
      numEmpleado: [obj.numEmpleado, [Validators.required]],
      areaId: [obj.areaId?.areaId, [Validators.required]],
      puestoId: [{ value: obj.puestoId?.puestoId, disabled: true }, [Validators.required]],
      sedeId: obj.sedeId?.sedeId,
      estadoId: obj.estadoId?.estadoId,
      fechaAntiguedad: [datePipe.transform(obj.fechaAntiguedad, 'yyyy-MM-dd'), [Validators.required]],
      fechaInicio: [datePipe.transform(obj.fechaInicio, 'yyyy-MM-dd'), [Validators.required]],
      fechaFin: [datePipe.transform(obj.fechaFin, 'yyyy-MM-dd')],
      jornadaId: [obj.jornadaId?.jornadaId, [Validators.required]],
      politicaId: [obj.politicaId?.politicaId, [Validators.required]],
      puesto_id_reporta: obj.jefeInmediatoId?.personaId,
      areaGeograficaId: [obj.areaGeograficaId?.areaGeograficaId,[Validators.required]],
      esSindicalizado: [`${obj.esSindicalizado}`],
      tipoContratoId: [obj.tipoContratoId?.tipoContratoId,[Validators.required]],
      fechaAltaImss:obj.fechaAltaImss,
      dias_vacaciones: [obj.diasVacaciones, Validators.required],
      tipoRegimenContratacionId: [obj.tipoRegimenContratacionId?.tipoRegimenContratacionId, [Validators.required]],

    });



  }



  public enviarFormulario() {
   
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      Object.values(this.myForm.controls).forEach(control =>{
        control.markAsTouched();
      });
      return;
    }


    const titulo = this.empleado.esActivo? "¿Deseas actualizar los datos del usuario?":`
    Usuario con baja`;

    const subtitulo = this.empleado.esActivo? "":`El empleado fue dado de baja previamente
    ¿Estás seguro de que deseas activar al empleado?
    Será considerado nuevamente en la generación de nóminas`;


 
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo,subtitulo).then(valor =>{
      if(valor){
        let obj = this.myForm.value;    
        
        let idTipoJornada = -1;    
        for(let item of this.arregloJornadas){    
          if(obj.jornadaId == item.jornadaId){             
            idTipoJornada = item.tipoJornadaId;
            break;
          }    
        }
        //******************************************* */


        if (obj.fechaAntiguedad != null && obj.fechaAntiguedad != '') {
          const fecha1 = new Date(obj.fechaAntiguedad).toUTCString().replace("GMT", "");
          obj.fechaAntiguedad = `${new Date(fecha1).getTime()}`;
        }

        if (obj.fechaInicio != null && obj.fechaInicio != '') {
          const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
          obj.fechaInicio = `${new Date(fecha1).getTime()}`;
        }
        if (obj.fechaFin != null && obj.fechaFin != '') {
          const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
          obj.fechaFin = `${new Date(fecha1).getTime()}`;
        }

        if (obj.fechaAltaImss != null && obj.fechaAltaImss != '') {
          const fecha1 = new Date(obj.fechaAltaImss).toUTCString().replace("GMT", "");
          obj.fechaAltaImss = `${new Date(fecha1).getTime()}`;
        }
    
    
  
        let objEnviar = {
          ...this.empleado,          
          areaId:{areaId:obj.areaId},
          puestoId:{puestoId:obj.puestoId},
          sedeId:{sedeId:obj.sedeId},
          estadoId:{estadoId:obj.estadoId},
          fechaAntiguedad:obj.fechaAntiguedad,
          fechaInicio:obj.fechaInicio,
          fechaFin:obj.fechaFin,
          jornadaId:{jornadaId:obj.jornadaId,tipoJornadaId:{tipoJornadaId:idTipoJornada}},
          tipoJornadaId:idTipoJornada,
          politicaId:{politicaId:obj.politicaId},
          jefeInmediatoId:{personaId:this.puestoIdReporta == 0 ? null : this.puestoIdReporta},
          esSindicalizado:obj.esSindicalizado,
          fechaAltaImss:obj.fechaAltaImss,
          numEmpleado:obj.numEmpleado,
          esActivo:true
      }

    
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      this.contratoColaboradorPrd.update(objEnviar).subscribe(datos =>{
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
          if(datos.resultado){
            this.empleado = datos.datos;
            this.myForm = this.createForm(this.empleado);           
            this.editarcampos = false;
          }
        });
      });
      
      

      }
    });
  }


  public cambiaArea() {
    this.myForm.controls.puestoId.disable();

    this.arregloPuestos = [];
    this.areasPrd.getPuestoByArea(this.usuariosSistemaPrd.getIdEmpresa(), this.myForm.controls.areaId.value).subscribe(datos => {

      this.arregloPuestos = datos.datos;
      this.myForm.controls.puestoId.enable();
    });
  }


  public get f() {
    return this.myForm.controls;
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


  

}
