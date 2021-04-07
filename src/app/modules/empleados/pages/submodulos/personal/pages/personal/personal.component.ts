import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomicilioService } from 'src/app/modules/empleados/services/domicilio.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;





  public editarcampos: boolean = false;
  public empleado: any = {
    nacionalidadId: { descripcion: "" }
  };
  public anio!: string;
  public mes!: string;
  public dia!: string;


  public idEmpleado: number = -1;

  public arreglonacionalidad?: Promise<any>;
  public arregloParenteesco?:Promise<any>;
  public domicilioArreglo:any = [];

  constructor(private formBuilder: FormBuilder,
    private navparams: ActivatedRoute, private empleadoPrd: EmpleadosService,
    private catalogosPrd: CatalogosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService,private domicilioPrd:DomicilioService) { }

  ngOnInit(): void {
    this.myForm = this.createForm({});
    this.navparams.params.subscribe(param => {

      this.idEmpleado = param["id"];




      this.empleadoPrd.getEmpleadoById(this.idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;
        console.log("Empleado",this.empleado);

        this.parsearInformacion();
        this.domicilioPrd.getDomicilioPorEmpleadoNativo(this.idEmpleado).subscribe(datos =>{
          this.domicilioArreglo = datos?.datos[0]
          console.log("Direccion",this.domicilioArreglo);
        });
        
        

        this.myForm = this.createForm(this.empleado);

      });




    });



    this.arreglonacionalidad = this.catalogosPrd.getNacinalidades(true).toPromise();

    this.arregloParenteesco = this.catalogosPrd.getCatalogoParentezco(true).toPromise();
  }



  public parsearInformacion() {
    if (this.empleado?.fechaNacimiento != null || this.empleado?.fechaNacimiento != undefined) {

      if(Number.isInteger(this.empleado.fechaNacimiento)){

        let date: Date = new Date(this.empleado.fechaNacimiento);
        let dia = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
        let mes = (date.getMonth() + 1) < 10 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`;
        let anio = date.getFullYear();
        this.empleado.fechaNacimiento = `${dia}/${mes}/${anio}`;

      }

      if (this.empleado.fechaNacimiento.trim() !== "") {

        let split = this.empleado.fechaNacimiento.split("/");

        this.anio = split[2];
        let mesint: number = Number(split[1]);
        let arreglo = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        this.mes = arreglo[mesint];
        this.dia = split[0];

      }

      switch(this.empleado.estadoCivil){
          case "S":
              this.empleado.estadoCivilDescripcion = "Soltero(a)";
            break;
            case "C":
              this.empleado.estadoCivilDescripcion = "Casado(a)";
            break;
            case "D":
              this.empleado.estadoCivilDescripcion = "Divorciado(a)";
            break;
            case "V":
              this.empleado.estadoCivilDescripcion = "Viudo(a)";
            break;
      }

    }
  }

  
  public validarfechNacimiento(fecha:any){

    debugger;

      var x=new Date();
      var fecha = fecha.split("-");
      x.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
      var today = new Date();
 
      if (x > today){

        this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la fecha actual')
        .then(()=> {
          this.myForm.controls.fechaNacimiento.setValue("");
        });
      }
  }

  public createForm(obj: any) {


    let genero = "";
    if (obj.genero == "F")
      genero = "true";
    else if (obj.genero == "M")
      genero = "false";


    let fechaNacimiento = "";
    if (obj.fechaNacimiento != undefined || obj.fechaNacimiento != null) {



      try {
        const l1 = obj.fechaNacimiento.split("/");
        fechaNacimiento = `${l1[2]}-${l1[1]}-${l1[0]}`;

      } catch {

      }

    }
    debugger;

    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: obj.apellidoMaterno,
      genero: [{ value: genero, disabled: true }],
      fechaNacimiento: [fechaNacimiento],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      nss: obj.nss,
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      emailCorporativo: [obj.emailCorporativo, [Validators.email]],
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      numeroHijos: obj.numeroHijos,
      url: obj.medioContacto?.url,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre, [Validators.required]],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno, [Validators.required]],
      contactoEmergenciaApellidoMaterno: [obj.contactoEmergenciaApellidoMaterno],
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail, [Validators.email]],
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono
    });
  }


  public enviandoFormulario() {



    this.submitEnviado = true;


    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);     
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas modificar los datos el empleado?").then(valor =>{
      if(valor){

        this.realizarOperacion();

      }
    });
  }


  public realizarOperacion(){

    let obj = this.myForm.value;

    let fechanacimiento = '';

    if (this.myForm.controls?.fechaNacimiento.value != null && this.myForm.controls?.fechaNacimiento.value != '') {
      const date: String = new Date(`${obj.fechaNacimiento}`).toUTCString();
      let aux = new Date(date.replace("GMT",""));
      fechanacimiento = `${aux.getTime()}`;  
    }


    let genero = "";
    if (obj.genero == "true")
      genero = "F";
    else if (obj.genero == "false")
      genero = "M";


    let objenviar = {
      nombre: obj.nombre,
      apellidoPaterno: obj.apellidoPaterno,
      apellidoMaterno: obj.apellidoMaterno,
      genero: genero,
      fechaNacimiento: fechanacimiento,
      tieneCurp: obj.tieneCurp,
      contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal,
      emailCorporativo: obj.emailCorporativo,
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: {
        nacionalidadId: obj.nacionalidadId
      },
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: obj.contactoInicialTelefono,
      tieneHijos: false,
      numeroHijos: obj.numeroHijos,
      medioContacto: {
        url: obj.url
      },
      contactoEmergenciaNombre: obj.contactoEmergenciaNombre,
      contactoEmergenciaApellidoPaterno: obj.contactoEmergenciaApellidoPaterno,
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: obj.contactoEmergenciaEmail,
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      curp: obj.curp,
      rfc: obj.rfc,
      nns: obj.nns,
      personaId: this.idEmpleado,
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
    }



    this.empleadoPrd.update(objenviar).subscribe(datos => {


      this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
        if(datos.resultado){

          this.empleado = datos.datos;
          this.parsearInformacion();
          this.myForm = this.createForm(this.empleado);
         
          this.editarcampos = false;

        }
      });
    });
  }

  public cancelarOperacion() {
  }


  public get f() {
    return this.myForm.controls;
  }


  public accionarMostrar() {
    this.myForm.controls.genero.enable();
  }

  public accionarCancelar() {
    this.myForm.controls.genero.disable();
  }

}
