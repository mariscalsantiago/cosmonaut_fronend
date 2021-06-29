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

  public domicilioCodigoPostal: any = [];
  public insertarDomicilio: boolean = false;



  public editarcampos: boolean = false;
  public empleado: any = {
    nacionalidadId: { descripcion: "" }
  };
  public anio!: string;
  public mes!: string;
  public dia!: string;


  public idEmpleado: number = -1;

  public arreglonacionalidad?: Promise<any>;
  public arregloParenteesco?: Promise<any>;
  public domicilioArreglo: any = [{}];
  public nombreEstado: string = "";
  public idEstado: number = 0;
  public nombreMunicipio: string = "";
  public idMunicipio: number = 0;

  constructor(private formBuilder: FormBuilder,
    private navparams: ActivatedRoute, private empleadoPrd: EmpleadosService,
    private catalogosPrd: CatalogosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private modalPrd: ModalService, private domicilioPrd: DomicilioService) { }

  ngOnInit(): void {
    this.myForm = this.createForm({});
    this.navparams.params.subscribe(param => {

      this.idEmpleado = param["id"];
      this.empleadoPrd.getEmpleadoById(this.idEmpleado).subscribe(datoscontrato => {

        console.log('datoscontrato',datoscontrato)
        
        this.empleado = datoscontrato.datos;
        this.parsearInformacion();
        this.domicilioPrd.getDomicilioPorEmpleadoNativo(this.idEmpleado).subscribe(datosnativo => {
          this.domicilioArreglo = datosnativo?.datos[0];
        });

        this.domicilioPrd.getDomicilioPorEmpleado(this.idEmpleado).subscribe(datosdomicilio => {

          if (datosdomicilio.datos !== undefined) {

            this.domicilioArreglo = datosdomicilio.datos[0];
            for (let llave in datosdomicilio.datos[0]) {
              this.empleado[llave] = datosdomicilio.datos[0][llave];


            }
            this.myForm = this.createForm(this.empleado);
            this.buscar(undefined);

            
          } else {
            this.createForm(this.empleado);
          }

          this.insertarDomicilio = datosdomicilio.datos == undefined;
        });





      });




    });



    this.arreglonacionalidad = this.catalogosPrd.getNacinalidades(true).toPromise();

    this.arregloParenteesco = this.catalogosPrd.getCatalogoParentezco(true).toPromise();
  }





  public buscar(obj: any) {

    this.myForm.controls.estado.setValue("");
    this.myForm.controls.municipio.setValue("");

    let valor: string = this.myForm.controls.codigo.value;

    if (this.myForm.controls.codigo.errors?.pattern === undefined && valor !== null) {
      if (valor.trim() !== "") {

        this.catalogosPrd.getAsentamientoByCodigoPostal(valor).subscribe(datos => {

          if (datos.resultado) {
            this.domicilioCodigoPostal = datos.datos;

            for (let item of datos.datos) {

              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;

              this.myForm.controls.municipio.setValue(this.nombreMunicipio);
              this.myForm.controls.estado.setValue(this.nombreEstado);


            }


            this.myForm.controls.asentamientoId.enable();
            this.myForm.controls.numExterior.enable();
            this.myForm.controls.numInterior.enable();
            this.myForm.controls.calle.enable();
          } else {
            this.myForm.controls.asentamientoId.disable();
            this.myForm.controls.numExterior.disable();
            this.myForm.controls.numInterior.disable();
            this.myForm.controls.calle.disable();
            this.nombreEstado = "";
            this.nombreMunicipio = "";
            this.idEstado = -1;
            this.idMunicipio = -1;
            this.domicilioCodigoPostal = []

          }
        });

      }
    }
  }



  public parsearInformacion() {
    if (this.empleado?.fechaNacimiento != null || this.empleado?.fechaNacimiento != undefined) {

      if (Number.isInteger(this.empleado.fechaNacimiento)) {

        let date: Date = new Date(this.empleado.fechaNacimiento);
        let dia = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
        let mes = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
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

      switch (this.empleado.estadoCivil) {
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


  public validarfechNacimiento(fecha: any) {



    var x = new Date();
    var fecha = fecha.split("-");
    x.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
    var today = new Date();

    if (x > today) {

      this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la fecha actual')
        .then(() => {
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


    
    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: obj.apellidoMaterno,
      genero: [{ value: genero, disabled: true }],
      fechaNacimiento: [fechaNacimiento,Validators.required],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      nss: obj.nss,
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      emailCorporativo: [{value:obj.emailCorporativo?.toLowerCase(),disabled:true}, [Validators.email]],
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      numeroHijos: obj.numeroHijos,
      url: obj.urlLinkedin,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno],
      contactoEmergenciaApellidoMaterno: [obj.contactoEmergenciaApellidoMaterno],
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail?.toLowerCase(), [Validators.email]],
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      codigo: [obj.codigo, [Validators.required, Validators.pattern('[0-9]+')]],
      estado: [{ value: obj.estado, disabled: true }, [Validators.required]],
      municipio: [{ value: obj.municipio, disabled: true }, [Validators.required]],
      asentamientoId: [{ value: obj.asentamientoId, disabled: true }, [Validators.required]],
      calle: [{ value: obj.calle, disabled: true }, [Validators.required]],
      numExterior: [{ value: obj.numExterior, disabled: true }, [Validators.required]],
      numInterior: { value: obj.numInterior, disabled: true },
      celular:[obj.celular]

    });
  }


  public enviandoFormulario() {



    this.submitEnviado = true;


    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas modificar los datos el empleado?").then(valor => {
      if (valor) {

        this.realizarOperacion();

      }
    });
  }


  public realizarOperacion() {

    let obj = this.myForm.value;

    let fechanacimiento = '';

    if (this.myForm.controls?.fechaNacimiento.value != null && this.myForm.controls?.fechaNacimiento.value != '') {
      const date: String = new Date(`${obj.fechaNacimiento}`).toUTCString();
      let aux = new Date(date.replace("GMT", ""));
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
      contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal?.toLowerCase(),
      nacionalidadId: {
        nacionalidadId: obj.nacionalidadId
      },
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: obj.contactoInicialTelefono,
      tieneHijos: false,
      numeroHijos: obj.numeroHijos,
      urlLinkedin: obj.url,
      contactoEmergenciaNombre: obj.contactoEmergenciaNombre,
      contactoEmergenciaApellidoPaterno: obj.contactoEmergenciaApellidoPaterno,
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: obj.contactoEmergenciaEmail?.toLowerCase(),
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      curp: obj.curp,
      rfc: obj.rfc,
      nss: obj.nss,
      personaId: this.idEmpleado,
      celular:obj.celular,
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
    }



    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.empleadoPrd.update(objenviar).subscribe(datos => {

      if (datos.resultado) {



        this.empleado = datos.datos;
        this.parsearInformacion();
        this.actualizarDomicilio();
        this.editarcampos = false;
      }else{
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
      }

    });
  }

  public actualizarDomicilio() {


    let obj = this.myForm.value;

    let objenviar: any =
    {
      codigo: obj.codigo,
      municipio: this.idMunicipio,
      estado: this.idEstado,
      asentamientoId: obj.asentamientoId,
      calle: obj.calle,
      numExterior: obj.numExterior,
      numInterior: obj.numInterior,
      personaId: {
        personaId: this.idEmpleado
      }
    }

    

    if (this.insertarDomicilio) {
      this.domicilioPrd.save(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        this.myForm = this.createForm(this.empleado);
        this.domicilioPrd.getDomicilioPorEmpleadoNativo(this.idEmpleado).subscribe(datosnativo => {
          this.domicilioArreglo = datosnativo?.datos[0];
        });

      });
    } else {


      
      objenviar.domicilioId = this.domicilioArreglo.domicilioId;

      this.domicilioPrd.update(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        this.myForm = this.createForm(this.empleado);
        this.domicilioPrd.getDomicilioPorEmpleadoNativo(this.idEmpleado).subscribe(datosnativo => {
          this.domicilioArreglo = datosnativo?.datos[0];
        });

      });
    }




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
